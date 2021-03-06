<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePostersTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{			//首页海报
		Schema::create('posters', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('image');				// 图片链接
			$table->string('link');		// 点击后的跳转链接
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('posters');
	}

}
