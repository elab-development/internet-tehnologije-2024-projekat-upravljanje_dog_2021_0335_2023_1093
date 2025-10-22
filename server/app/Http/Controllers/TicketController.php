<?php

namespace App\Http\Controllers;

use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $query = Ticket::query()
            ->with(['event.category', 'user'])
            ->orderByDesc('created_at');

        if ($request->filled('event_id')) {
            $query->where('event_id', (int) $request->input('event_id'));
        }

        if (Auth::user()->role !== 'admin') {
            $query->where('user_id', Auth::id());
        }

        $tickets = $query->get();

        if ($tickets->isEmpty()) {
            return response()->json('No tickets found.', 404);
        }

        return response()->json([
            'tickets' => TicketResource::collection($tickets),
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
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $authUser = Auth::user();
        $allowedStatuses = ['pending', 'confirmed', 'cancelled'];

        // Odredi kome pravimo kartu
        $targetUserId = $authUser->role === 'admin'
            ? (int) $request->input('user_id', $authUser->id)
            : $authUser->id;

        // Osnovna pravila (unique(event_id,user_id))
        $rules = [
            'event_id' => [
                'required',
                'integer',
                'exists:events,id',
                Rule::unique('tickets')->where(
                    fn($q) => $q->where('event_id', (int) $request->input('event_id'))
                        ->where('user_id',  $targetUserId)
                ),
            ],
        ];

        if ($authUser->role === 'admin') {
            // Admin sme user_id, status i price
            $rules['user_id'] = ['sometimes', 'required', 'integer', 'exists:users,id'];
            $rules['status']  = ['sometimes', 'required', Rule::in($allowedStatuses)];
            $rules['price']   = ['sometimes', 'nullable', 'numeric', 'min:0'];
        } else {
            // Useru eksplicitno ZABRANI slanje price (ako pošalje -> 422)
            $rules['price'] = ['prohibited'];
            // User ne može da postavi status – uvek pending
        }

        $validated = $request->validate($rules, [
            'event_id.unique' => 'Korisnik već ima kartu za ovaj događaj.',
        ]);

        $status = $authUser->role === 'admin'
            ? ($request->input('status', 'pending'))
            : 'pending';

        $price = $authUser->role === 'admin'
            ? ($validated['price'] ?? null)
            : null;

        $ticket = Ticket::create([
            'event_id' => (int) $validated['event_id'],
            'user_id'  => $targetUserId,
            'status'   => $status,
            'price'    => $price,
        ])->load(['event.category', 'user']);

        return response()->json([
            'message' => 'Ticket created successfully',
            'ticket'  => new TicketResource($ticket),
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can update tickets'], 403);
        }

        // Admin može menjati status i/ili cenu
        $data = $request->validate([
            'status' => ['sometimes', Rule::in(['pending', 'confirmed', 'cancelled'])],
            'price'  => ['sometimes', 'nullable', 'numeric', 'min:0'],
        ]);

        // Bar jedno polje mora doći
        if (!array_key_exists('status', $data) && !array_key_exists('price', $data)) {
            return response()->json([
                'errors' => ['update' => ['Provide at least one of: status or price.']]
            ], 422);
        }

        $ticket->update($data);
        $ticket->load(['event.category', 'user']);

        return response()->json([
            'message' => 'Ticket updated successfully',
            'ticket'  => new TicketResource($ticket),
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $user = Auth::user();

        if ($user->role !== 'admin' && $ticket->user_id !== $user->id) {
            return response()->json(['error' => 'You can only delete your own tickets'], 403);
        }

        $ticket->delete();

        return response()->json([
            'message' => 'Ticket deleted successfully',
        ]);
    }
}
