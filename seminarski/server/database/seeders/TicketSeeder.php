<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('role', 'user')->get();
        if ($users->isEmpty()) return;

        $categoryPrices = [
            'Webinar'    => 0.00,
            'Meetup'     => 0.00,
            'Workshop'   => 1200.00,
            'Conference' => 3000.00,
            'Concert'    => 1800.00,
        ];

        Event::with('category')->get()->each(function ($event) use ($users, $categoryPrices) {
            // 2-4 učesnika po događaju
            $count = min($users->count(), rand(2, 4));
            $attendees = $users->random($count);

            $basePrice = $categoryPrices[$event->category->name ?? 'Meetup'] ?? 0.00;

            foreach ($attendees as $u) {
                Ticket::firstOrCreate(
                    ['event_id' => $event->id, 'user_id' => $u->id],
                    [
                        'status' => collect(['confirmed', 'pending', 'confirmed', 'confirmed'])->random(),
                        'price'  => $basePrice,
                    ]
                );
            }
        });
    }
}
