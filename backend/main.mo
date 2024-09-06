import Func "mo:base/Func";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Time "mo:base/Time";
import List "mo:base/List";
import Order "mo:base/Order";

actor {
  // Define the Post type
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Time.Time;
  };

  // Stable variable to store posts
  stable var posts : List.List<Post> = List.nil();
  stable var nextId : Nat = 0;

  // Function to sort posts
  func sortPosts(posts : List.List<Post>) : List.List<Post> {
    List.foldLeft(posts, List.nil(), func (acc : List.List<Post>, post : Post) : List.List<Post> {
      func insert(xs : List.List<Post>, x : Post) : List.List<Post> {
        switch xs {
          case null { ?(x, null) };
          case (?(y, ys)) {
            if (x.timestamp > y.timestamp) {
              ?(x, xs)
            } else {
              ?(y, insert(ys, x))
            }
          };
        }
      };
      insert(acc, post)
    })
  };

  // Query to get all posts in reverse chronological order
  public query func getPosts() : async [Post] {
    let sortedPosts = sortPosts(posts);
    List.toArray(sortedPosts)
  };

  // Update call to create a new post
  public func createPost(title: Text, body: Text, author: Text) : async () {
    let newPost : Post = {
      id = nextId;
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := List.push(newPost, posts);
    nextId += 1;
  };
}
