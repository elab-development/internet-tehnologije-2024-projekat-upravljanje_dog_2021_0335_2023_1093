<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cat = Category::pluck('id', 'name');

        $tz = 'Europe/Belgrade';

        $events = [
            [
                'title'       => 'Laravel Srbija Meetup',
                'description' => 'Dva kratka predavanja i networking uz pizzu.',
                'location'    => 'Beograd, ICT Hub',
                'start_time'  => Carbon::now($tz)->addDays(10)->setTime(18, 0),
                'end_time'    => Carbon::now($tz)->addDays(10)->setTime(20, 0),
                'category'    => 'Meetup',
            ],
            [
                'title'       => 'Frontend Workshop: React Basics',
                'description' => 'Praktična radionica – kreiranje SPA aplikacije od nule.',
                'location'    => 'Novi Sad, Startit Centar',
                'start_time'  => Carbon::now($tz)->addDays(15)->setTime(10, 0),
                'end_time'    => Carbon::now($tz)->addDays(15)->setTime(14, 0),
                'category'    => 'Workshop',
            ],
            [
                'title'       => 'Tech Conference: Data & AI 2025',
                'description' => 'Konferencija o primeni veštačke inteligencije i analitike podataka.',
                'location'    => 'Beograd, Sava Centar',
                'start_time'  => Carbon::now($tz)->addDays(30)->setTime(9, 0),
                'end_time'    => Carbon::now($tz)->addDays(30)->setTime(17, 0),
                'category'    => 'Conference',
            ],
            [
                'title'       => 'Acoustic Night',
                'description' => 'Veče akustične muzike lokalnih izvođača.',
                'location'    => 'Niš, Gradski kulturni centar',
                'start_time'  => Carbon::now($tz)->addDays(5)->setTime(20, 0),
                'end_time'    => Carbon::now($tz)->addDays(5)->setTime(22, 0),
                'category'    => 'Concert',
            ],
            [
                'title'       => 'Remote Webinar: Intro to Docker',
                'description' => 'Osnove dockera, images, containers i best practices.',
                'location'    => 'Online',
                'start_time'  => Carbon::now($tz)->addDays(7)->setTime(18, 0),
                'end_time'    => Carbon::now($tz)->addDays(7)->setTime(19, 30),
                'category'    => 'Webinar',
            ],
        ];

        foreach ($events as $e) {
            Event::updateOrCreate(
                ['title' => $e['title']],
                [
                    'description' => $e['description'],
                    'location'    => $e['location'],
                    'start_time'  => $e['start_time'],
                    'end_time'    => $e['end_time'],
                    'category_id' => $cat[$e['category']] ?? null,
                ]
            );
        }
    }
}
