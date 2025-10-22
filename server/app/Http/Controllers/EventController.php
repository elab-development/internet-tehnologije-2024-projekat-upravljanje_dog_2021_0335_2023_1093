<?php

namespace App\Http\Controllers;

use App\Http\Resources\EventResource;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = max(1, (int) $request->input('per_page', 10));

        $query = Event::with(['category'])
            ->withCount('tickets')
            ->when($request->filled('category_id'), function ($q) use ($request) {
                $q->where('category_id', (int) $request->input('category_id'));
            })
            ->orderBy('start_time');

        $events = $query->paginate($perPage);

        if ($events->total() === 0) {
            return response()->json('No events found.', 404);
        }

        return response()->json([
            'events' => EventResource::collection($events->items()),
            'meta' => [
                'current_page' => $events->currentPage(),
                'last_page'    => $events->lastPage(),
                'per_page'     => $events->perPage(),
                'total'        => $events->total(),
            ],
            'links' => [
                'first' => $events->url(1),
                'last'  => $events->url($events->lastPage()),
                'prev'  => $events->previousPageUrl(),
                'next'  => $events->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can create events'], 403);
        }

        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location'    => ['nullable', 'string', 'max:255'],
            'start_time'  => ['required', 'date'],
            'end_time'    => ['nullable', 'date', 'after_or_equal:start_time'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
        ]);

        $event = Event::create($validated)->load(['category'])->loadCount('tickets');

        return response()->json([
            'message' => 'Event created successfully',
            'event'   => new EventResource($event),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        $event->load(['category'])->loadCount('tickets');

        return response()->json([
            'event' => new EventResource($event),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can update events'], 403);
        }

        $data = $request->validate([
            'title'       => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'location'    => ['sometimes', 'nullable', 'string', 'max:255'],
            'start_time'  => ['sometimes', 'date'],
            'end_time'    => ['sometimes', 'nullable', 'date'],
            'category_id' => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],
        ]);

        // Ako stiže samo end_time (bez start_time), ručno proveri odnos sa postojećim start_time
        if (array_key_exists('end_time', $data)) {
            $start = isset($data['start_time']) ? new Carbon($data['start_time']) : new Carbon($event->start_time);
            $end   = $data['end_time'] ? new Carbon($data['end_time']) : null;

            if ($end && $end->lt($start)) {
                return response()->json([
                    'errors' => ['end_time' => ['The end_time must be a date after or equal to start_time.']]
                ], 422);
            }
        }

        $event->update($data);
        $event->load(['category'])->loadCount('tickets');

        return response()->json([
            'message' => 'Event updated successfully',
            'event'   => new EventResource($event),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can delete events'], 403);
        }

        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully',
        ]);
    }
}
