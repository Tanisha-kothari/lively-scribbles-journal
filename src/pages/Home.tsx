
import React from "react";
import { BlogCard } from "@/components/BlogCard";
import { useBlog } from "@/contexts/BlogContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function Home() {
  const { blogs, likeBlog } = useBlog();
  const { user } = useAuth();

  const isLiked = (blogId: string) => {
    return user && blogs.some(blog => blog.id === blogId && blog.likes.includes(user.username));
  };

  const handleLike = (blogId: string) => {
    if (!user) {
      // Redirect to login if not logged in
      window.location.href = "/login";
      return;
    }
    likeBlog(blogId);
  };

  const featuredBlogs = blogs.slice(0, 1);
  const recentBlogs = blogs.slice(1);

  return (
    <div className="container py-8">
      <section className="mb-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 bg-gradient-to-r from-blog-primary to-blog-secondary bg-clip-text text-transparent">
            Scribbles Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your thoughts, stories, and ideas with the world. Create beautiful blog posts with rich formatting.
          </p>
          <div className="mt-8">
            <Link to={user ? "/write" : "/login"}>
              <Button size="lg" className="gap-2">
                <BookOpen className="h-5 w-5" />
                {user ? "Write a Blog" : "Login to Start Writing"}
              </Button>
            </Link>
          </div>
        </div>
        
        {featuredBlogs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold font-heading mb-6">Featured Post</h2>
            <div className="grid grid-cols-1 gap-8">
              <div className="bg-gradient-to-br from-blog-accent to-white p-1 rounded-xl shadow-lg">
                <BlogCard
                  blog={featuredBlogs[0]}
                  onLike={handleLike}
                  isLiked={isLiked(featuredBlogs[0].id)}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading mb-6">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentBlogs.map((blog) => (
            <BlogCard 
              key={blog.id} 
              blog={blog} 
              onLike={handleLike} 
              isLiked={isLiked(blog.id)}
            />
          ))}
          {recentBlogs.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">No blog posts yet. Be the first to create one!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
