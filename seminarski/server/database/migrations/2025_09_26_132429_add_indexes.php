<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->index('start_time', 'events_start_time_idx');
            $table->index('location', 'events_location_idx');
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->index('status', 'tickets_status_idx');
            $table->index('created_at', 'tickets_created_at_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex('events_start_time_idx');
            $table->dropIndex('events_location_idx');
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->dropIndex('tickets_status_idx');
            $table->dropIndex('tickets_created_at_idx');
        });
    }
};
