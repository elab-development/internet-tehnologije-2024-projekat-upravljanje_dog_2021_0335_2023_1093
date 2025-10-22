<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'user_id'  => User::factory(),
            'status'   => $this->faker->randomElement(['pending', 'confirmed', 'cancelled']),
            'price'    => $this->faker->optional()->randomFloat(2, 0, 199.99),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn() => ['status' => 'pending']);
    }

    public function confirmed(): static
    {
        return $this->state(fn() => ['status' => 'confirmed']);
    }

    public function cancelled(): static
    {
        return $this->state(fn() => ['status' => 'cancelled']);
    }
}
