<?php

use Gregwar\Captcha\CaptchaBuilder;
class UserPageController extends BaseController{

	public function login()
	{
		Session_start();
		$builder = new CaptchaBuilder;
		$builder->build();
		$phrase = $builder->getPhrase();
		$_SESSION['phrase'] = $phrase;
		return View::make('login')->with(array(
			'captcha' 	=> $builder,
			'links' 	=>$this->link()
		));
	}

	public function getRemind()
	{
		return View::make('password/remind');
	}

	public function getReset()
	{
		return View::make('password/reset')->with('msgs', array());
	}

	//空间首页
	public function spaceHome()
	{	
		$user_id = Input::get('user_id');
		$user = User::find($user_id);
		// dd($user_id);	

		$albums 		= $user->hasManyAlbums()->get();
 		$topics			= $user->hasManyTopics()->get();
 		// dd($albums);

 		$pictureCount = array();
 		$picture  = array();
 		$topicCommentCount = array();
 		if($albums != null)
 		{	
 			foreach($albums as $album)
 			{	
 				$pictures 			= $album->hasManyPictures()->get();
 				$pictureCount[$album['id']] 	= $pictures->count();
 				$p 				= $pictures->toArray();
 				if($p != null )
 				{
 					$picture[$album['id']]	 = $p[0]['picture'];
 				}
 				else 
 				{
 					$picture[$album['id']]	 = "http://7xk6xh.com1.z0.glb.clouddn.com/album_03.png";
 				}
 			}
 		}

 		if($topics != null)
 		{
 			foreach($topics as $topic)
 			{
 				$topicCommentCount[$topic['id']] = $topic->hasManyTopicComments()->count();
 			}
 		}

 		$albums 			= Album::where('user_id', '=', $user_id)->paginate(2);
 		$topics 			= Topic::where('user_id', '=', $user_id)->paginate(2);
			
		$result = array(
			'user' 	  		  		=> $user,
			'albums'  		  		=> $albums,
			'topics'   		  		=> $topics,
			'pictureCount' 	  		=>$pictureCount,
			'picture'		 	 	=>$picture,
			'topicCommentCount'    	=> $topicCommentCount,
			'links' 			  	=>$this->link()
		);

		return View::make('userCenter.zone')->with($result);
	}

	//话题动态
	public function topic()
	{
		$user_id = Input::get('user_id');
		$user = User::find($user_id);
		$topics = $user->hasManyTopics()->get();
		if($topics != null)
		{
			foreach($topics as $topic)
			{
				$topic["commentsCount"] = $topic->hasManyTopicComments()->count();
			}		
		}
		return View::make('userCenter.dynamic')->with(array(
			'topics' => $topics,
			'user'   => $user,
			'links' 	=>$this->link()
			));
	}

	//相册
	public function album()
	{
		$user_id = Input::get('user_id');
		$user = User::find($user_id);
		$albums = $user->hasManyAlbums()->get();

		if($albums != null)
		{
			foreach($albums as $album)
			{
				$album->albumCount 	= $album->hasManyPictures()->count();
				$pictures 		= $album->hasManyPictures()->get();
				$pictures 		= $pictures->toArray();
				if($pictures == null)
				{
					$album->picture 	= "http://7xk6xh.com1.z0.glb.clouddn.com/album_03.png";
				}else{

					$album->picture	= $pictures[0]['picture'];
				}
				$album->save();
			}	
		}
		$albums = Album::where('user_id','=', $user_id)->paginate(6);

		return View::make('userCenter.photo-album')->with(array(
			'albums' 	=> $albums,
			'user' 		=> $user,
			'links' 		=>$this->link()
			));
	}

	//照片
	public function picture($album_id)
	{
		 $album = Album::find($album_id);

		 $pictures = $album->hasManyPictures()->get();

		 return View::make('照片')->with(array(
		 	'pictures' 	=> $pictures,
		 	'links' 		=>$this->link()
		 	));
	}

	//个人中心——获取留言
	public function message()
	{	
		$user_id = Input::get('user_id');
		$user = User::find($user_id);
		$messages = Message::where('receiver_id', '=', $user_id)->get();
		foreach($messages as $message)
		{
			$message['sender'] 			= User::find($message['sender_id'])->username;
			$message['avatar']				= User::find($message['sender_id'])->avatar;
			$message['messageCommentCount']	= $message->MessageComments()->count();
		}
		return View::make('userCenter.message')->with(array(
			'messages' 	=> $messages,
			'user' 	 	=> $user,
			'links' 		=>$this->link()
			));
	}

	//个人中心——获取回复
	public function messageComment($message_id)
	{

		$message_comments = MessageComment::where('message_id', '=', $message_id);
		foreach($message_comments as $message_comment)
		{
			$message_comment['avatar']	=	User::find($message_comment['user_id'])->avatar;
			$message_comment['username']   = 	User::find($message_comment['user_id'])->username;
		}
		return View::make('回复信息')->with(array(
			'message_comments' => $message_comments,
			'links' 			=>$this->link()
			)); 
	}

	//获取更新资料界面
	public function getUpdate()
	{
		$user_id = Input::get('user_id');

		$user = User::find($user_id);

		return View::make('userCenter.information')->with(array(
				'user'		=>$user,
				'links' 		=>$this->link()
			));
	}

	
}