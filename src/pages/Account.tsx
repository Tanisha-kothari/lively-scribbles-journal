
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBlog } from "@/contexts/BlogContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlogCard } from "@/components/BlogCard";
import { BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Account() {
  const { user, isAuthenticated } = useAuth();
  const { getUserBlogs } = useBlog();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const userBlogs = user ? getUserBlogs(user.username) : [];

  if (!user) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar} alt={user.displayName} />
            <AvatarFallback className="text-2xl">{user.displayName[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold font-heading mb-2">{user.displayName}</h1>
            <p className="text-muted-foreground mb-4">@{user.username}</p>
            <p className="mb-4">{user.bio || "No bio yet."}</p>
            <Button onClick={() => navigate("/write")} className="gap-2">
              <BookOpen className="h-4 w-4" />
              Write New Blog
            </Button>
          </div>
        </div>

        <Tabs defaultValue="blogs" className="mt-8">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="blogs" className="flex-1">My Blogs ({userBlogs.length})</TabsTrigger>
            <TabsTrigger value="liked" className="flex-1">Liked Blogs (coming soon)</TabsTrigger>
          </TabsList>
          <TabsContent value="blogs">
            {userBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} showInteractions={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">No blogs yet</h3>
                <p className="text-muted-foreground mb-4">You haven't written any blogs yet.</p>
                <Button onClick={() => navigate("/write")}>Write Your First Blog</Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="liked">
            <div className="text-center py-16 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">This feature will be available in future updates.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
