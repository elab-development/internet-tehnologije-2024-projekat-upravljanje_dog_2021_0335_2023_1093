<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'location'    => $this->location,
            'start_time'  => optional($this->start_time)->toISOString(),
            'end_time'    => optional($this->end_time)->toISOString(),
            'category'    => new CategoryResource($this->whenLoaded('category')),
            'tickets_count' => $this->when(isset($this->tickets_count), $this->tickets_count),
        ];
    }
}
