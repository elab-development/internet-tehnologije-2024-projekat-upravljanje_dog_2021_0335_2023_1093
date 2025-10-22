<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Conference',
                'description' => 'Višednevni i jednodnevni događaji sa predavanjima i panelima.'
            ],
            [
                'name' => 'Workshop',
                'description' => 'Praktične radionice sa manjim grupama i mentorisanjem.'
            ],
            [
                'name' => 'Meetup',
                'description' => 'Neformalna okupljanja zajednice uz kraća predavanja.'
            ],
            [
                'name' => 'Concert',
                'description' => 'Muzicki događaji – solo nastupi i bendovi.'
            ],
            [
                'name' => 'Webinar',
                'description' => 'Online predavanja i demonstracije alata/tehnologija.'
            ],
        ];

        foreach ($categories as $c) {
            Category::firstOrCreate(['name' => $c['name']], ['description' => $c['description']]);
        }
    }
}
