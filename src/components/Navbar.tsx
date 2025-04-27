
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Book, Home, LogIn, User, UserPlus } from "lucide-react";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Book className="h-6 w-6 text-blog-primary" />
          </Link>
          <Link to="/" className="text-xl font-heading font-semibold text-blog-primary">
            Scribbles
          </Link>
        </div>

        <nav className="flex items-center gap-2">
          <Link to="/" className="text-sm font-medium flex items-center gap-1 px-3 py-2 hover:text-blog-primary transition-colors">
            <Home className="h-4 w-4" />
            <span className="hidden md:inline">Home</span>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/write" className="hidden md:inline-flex">
                <Button variant="outline">Write a blog</Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.displayName} />
                      <AvatarFallback>{user?.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/write" className="cursor-pointer md:hidden">
                      <Book className="mr-2 h-4 w-4" />
                      Write a blog
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogIn className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
