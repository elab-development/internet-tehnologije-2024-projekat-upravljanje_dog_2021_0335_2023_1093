<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@events.local'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]
        );

        $users = [
            ['name' => 'Nikola Nikolić', 'email' => 'nikola@events.local'],
            ['name' => 'Ana Petrović',    'email' => 'ana@events.local'],
            ['name' => 'Marko Jovanović', 'email' => 'marko@events.local'],
            ['name' => 'Milica Ilić',     'email' => 'milica@events.local'],
            ['name' => 'Jovan Nikolić',   'email' => 'jovan@events.local'],
        ];

        foreach ($users as $u) {
            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'password' => Hash::make('password'),
                    'role' => 'user',
                    'email_verified_at' => now(),
                    'remember_token' => Str::random(10),
                ]
            );
        }

        $this->call([
            CategorySeeder::class,
            EventSeeder::class,
            TicketSeeder::class,
        ]);
    }
}
