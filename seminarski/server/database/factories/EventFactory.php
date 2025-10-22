<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('-10 days', '+60 days');
        $end = (clone $start)->modify('+' . $this->faker->numberBetween(1, 8) . ' hours');

        return [
            'title'       => $this->faker->sentence(3),
            'description' => $this->faker->optional()->paragraph(),
            'location'    => $this->faker->city(),
            'start_time'  => $start,
            'end_time'    => $end,
            'category_id' => Category::factory(),
        ];
    }

    public function past(): static
    {
        return $this->state(function () {
            $start = $this->faker->dateTimeBetween('-60 days', '-1 day');
            $end = (clone $start)->modify('+' . $this->faker->numberBetween(1, 8) . ' hours');
            return [
                'start_time' => $start,
                'end_time'   => $end,
            ];
        });
    }

    public function upcoming(): static
    {
        return $this->state(function () {
            $start = $this->faker->dateTimeBetween('+1 day', '+90 days');
            $end = (clone $start)->modify('+' . $this->faker->numberBetween(1, 8) . ' hours');
            return [
                'start_time' => $start,
                'end_time'   => $end,
            ];
        });
    }
}
