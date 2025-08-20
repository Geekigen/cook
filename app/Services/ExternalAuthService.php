<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\RequestException;
use Carbon\Carbon;

class ExternalAuthService
{
    private string $apiUrl;
    private string $apiKey;
    private int $timeout;

    public function __construct()
    {
        $this->apiUrl = config('services.external_auth.url');
        $this->apiKey = config('services.external_auth.api_key');
        $this->timeout = config('services.external_auth.timeout', 30);
    }

    /**
     * Register a new user with the external API
     */
    public function register(array $userData): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders($this->getHeaders())
                ->post($this->apiUrl . '/register', [
                    'name' => $userData['name'],
                    'email' => $userData['email'],
                    'password' => $userData['password'],
                    // Add any additional fields your API requires
                ]);

            if ($response->successful()) {
                return $this->handleSuccessfulResponse($response->json());
            }

            return $this->handleErrorResponse($response);

        } catch (RequestException $e) {
            Log::error('External API request failed during registration', [
                'error' => $e->getMessage(),
                'email' => $userData['email'] ?? 'unknown'
            ]);

            return [
                'success' => false,
                'message' => 'Network error occurred while connecting to authentication service',
                'error_code' => 'NETWORK_ERROR'
            ];
        }
    }

    /**
     * Login user with external API
     */
    public function login(string $email, string $password): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders($this->getHeaders())
                ->post($this->apiUrl . '/login', [
                    'email' => $email,
                    'password' => $password,
                ]);

            if ($response->successful()) {
                return $this->handleSuccessfulResponse($response->json());
            }

            return $this->handleErrorResponse($response);

        } catch (RequestException $e) {
            Log::error('External API request failed during login', [
                'error' => $e->getMessage(),
                'email' => $email
            ]);

            return [
                'success' => false,
                'message' => 'Network error occurred while connecting to authentication service',
                'error_code' => 'NETWORK_ERROR'
            ];
        }
    }

    /**
     * Refresh an existing token
     */
    public function refreshToken(string $token): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders(array_merge($this->getHeaders(), [
                    'Authorization' => 'Bearer ' . $token
                ]))
                ->post($this->apiUrl . '/refresh');

            if ($response->successful()) {
                return $this->handleSuccessfulResponse($response->json());
            }

            return $this->handleErrorResponse($response);

        } catch (RequestException $e) {
            Log::error('External API token refresh failed', [
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to refresh authentication token',
                'error_code' => 'REFRESH_ERROR'
            ];
        }
    }

    /**
     * Validate token with external API
     */
    public function validateToken(string $token): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $token,
                    'Accept' => 'application/json'
                ])
                ->get($this->apiUrl . '/validate');

            if ($response->successful()) {
                return [
                    'success' => true,
                    'valid' => true,
                    'user_data' => $response->json()['user'] ?? null
                ];
            }

            return [
                'success' => true,
                'valid' => false,
                'message' => 'Token is invalid or expired'
            ];

        } catch (RequestException $e) {
            Log::error('External API token validation failed', [
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to validate token',
                'error_code' => 'VALIDATION_ERROR'
            ];
        }
    }

    /**
     * Logout user from external API
     */
    public function logout(string $token): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $token,
                    'Accept' => 'application/json'
                ])
                ->post($this->apiUrl . '/logout');

            return [
                'success' => $response->successful(),
                'message' => $response->successful() ? 'Logged out successfully' : 'Logout failed'
            ];

        } catch (RequestException $e) {
            Log::error('External API logout failed', [
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to logout from external service'
            ];
        }
    }

    /**
     * Get request headers for API calls
     */
    private function getHeaders(): array
    {
        return [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'X-API-Key' => $this->apiKey, // or 'Authorization' => 'Bearer ' . $this->apiKey
        ];
    }

    /**
     * Handle successful API response
     */
    private function handleSuccessfulResponse(array $data): array
    {
        return [
            'success' => true,
            'token' => $data['token'] ?? $data['access_token'] ?? null,
            'expires_at' => $this->parseExpirationTime($data),
            'user_data' => $data['user'] ?? null,
            'refresh_token' => $data['refresh_token'] ?? null,
        ];
    }

    /**
     * Handle error response from API
     */
    private function handleErrorResponse($response): array
    {
        $statusCode = $response->status();
        $responseData = $response->json();

        // Log the error for debugging
        Log::warning('External API returned error', [
            'status_code' => $statusCode,
            'response' => $responseData
        ]);

        $message = $responseData['message'] ?? $responseData['error'] ?? 'Unknown API error';

        // Map common HTTP status codes to user-friendly messages
        $userMessage = match($statusCode) {
            400 => 'Invalid request data provided',
            401 => 'Invalid credentials',
            403 => 'Access forbidden',
            409 => 'User already exists',
            422 => $message, // Usually validation errors, show the actual message
            429 => 'Too many requests. Please try again later',
            500, 502, 503, 504 => 'Authentication service is temporarily unavailable',
            default => $message
        };

        return [
            'success' => false,
            'message' => $userMessage,
            'error_code' => $responseData['error_code'] ?? 'API_ERROR_' . $statusCode,
            'status_code' => $statusCode
        ];
    }

    /**
     * Parse expiration time from API response
     */
    private function parseExpirationTime(array $data): ?Carbon
    {
        if (isset($data['expires_at'])) {
            return Carbon::parse($data['expires_at']);
        }

        if (isset($data['expires_in'])) {
            return Carbon::now()->addSeconds((int) $data['expires_in']);
        }

        return null;
    }
}
