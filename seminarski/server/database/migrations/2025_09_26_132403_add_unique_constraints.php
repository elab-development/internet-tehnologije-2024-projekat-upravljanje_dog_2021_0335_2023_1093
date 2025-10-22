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
        Schema::table('categories', function (Blueprint $table) {
            $table->unique('name', 'categories_name_unique');
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->unique(['event_id', 'user_id'], 'tickets_event_user_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropUnique('categories_name_unique');
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->dropUnique('tickets_event_user_unique');
        });
    }
};
