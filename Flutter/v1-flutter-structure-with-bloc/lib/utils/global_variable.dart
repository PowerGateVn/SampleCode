import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_structure/screens/add-post/add_post_screen.dart';
import 'package:flutter_structure/screens/feed/feed_screen.dart';
import 'package:flutter_structure/screens/profile/profile_screen.dart';
import 'package:flutter_structure/screens/search/search_screen.dart';

const webScreenSize = 600;

List<Widget> homeScreenItems = [
  const FeedScreen(),
  const SearchScreen(),
  const AddPostScreen(),
  const Text('notifications'),
  ProfileScreen(
    uid: FirebaseAuth.instance.currentUser!.uid,
  ),
];
