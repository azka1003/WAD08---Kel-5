public function up(): void
{
    Schema::create('reviews', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('kost_id')->constrained('kosts')->onDelete('cascade');
        $table->integer('rating');
        $table->text('comment')->nullable();
        $table->timestamps();
    });
}