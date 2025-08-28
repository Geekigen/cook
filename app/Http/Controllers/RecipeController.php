<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Recipe;

use Illuminate\Http\Request;

class RecipeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $recipes = Recipe::with('categories')->get();
        return Inertia::render('recipe/index', ['recipes' => $recipes]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('recipe/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'description' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'instructions' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
            'price' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
        ]);
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('recipes', 'public');
        }
        $recipe = Recipe::create([
            'title' => $request->title,
            'image' => $imagePath,
            'description' => $request->description,
            'ingredients' => $request->ingredients,
            'instructions' => $request->instructions,
            'user_id' => $request->user_id,
            'category_id' => $request->category_id,
            'price' => $request->price,
        ]);
        return redirect()->route('recipes.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $recipe = Recipe::with('categories')->findOrFail($id);
        return Inertia::render('recipe/show', ['recipe' => $recipe]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $recipe = Recipe::findOrFail($id);
        return Inertia::render('recipe/edit', ['recipe' => $recipe]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'title' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'description' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'instructions' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
            'price' => 'nullable|numeric|min:0',
        ]);
        $recipe = Recipe::findOrFail($id);
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('recipes', 'public');
            $recipe->image = $imagePath;
        }
        $recipe->title = $request->title;
        $recipe->description = $request->description;
        $recipe->ingredients = $request->ingredients;
        $recipe->instructions = $request->instructions;
        $recipe->user_id = $request->user_id;
        $recipe->category_id = $request->category_id;
        $recipe->price = $request->price;
        $recipe->save();
        return redirect()->route('recipes.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $recipe = Recipe::findOrFail($id);
        $recipe->delete();
        return redirect()->route('recipes.index');
    }
}
