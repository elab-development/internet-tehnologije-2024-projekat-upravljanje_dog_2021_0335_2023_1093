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
            $table->foreign('category_id')
                ->references('id')->on('categories')
                ->nullOnDelete();
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->foreign('event_id')
                ->references('id')->on('events')
                ->cascadeOnDelete();

            $table->foreign('user_id')
                ->references('id')->on('users')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_and_ticket_tables', function (Blueprint $table) {
            Schema::table('events', function (Blueprint $table) {
                $table->dropForeign(['category_id']);
            });

            Schema::table('tickets', function (Blueprint $table) {
                $table->dropForeign(['event_id']);
                $table->dropForeign(['user_id']);
            });
        });
    }
};
