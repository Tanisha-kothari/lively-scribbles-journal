
import React, { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { Comment } from "@/contexts/BlogContext";
import { useAuth } from "@/contexts/AuthContext";

interface CommentsProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export function Comments({ comments, onAddComment }: CommentsProps) {
  const [newComment, setNewComment] = useState("");
  const { isAuthenticated } = useAuth();

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold font-heading" id="comments">Comments ({comments.length})</h3>
      
      {isAuthenticated && (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </form>
      )}
      
      {!isAuthenticated && (
        <div className="p-4 bg-muted rounded-md text-center">
          Please log in to add comments
        </div>
      )}
      
      <div className="space-y-6 mt-8">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 animate-fade-in">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.author.avatar} alt={comment.author.displayName} />
                <AvatarFallback>{comment.author.displayName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{comment.author.displayName}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
