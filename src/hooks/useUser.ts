import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/config/api";
import { redirect } from "react-router-dom";

export const useUser = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkIsAuthenticated = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (currentUser) {
          setCurrentUserId(currentUser?.uid);
        } else {
          setCurrentUserId(null);
          redirect("/sign-in")
        }
      } catch (error) {
        console.error("Error fetching current user", error);
        setCurrentUserId(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkIsAuthenticated();
  }, [currentUserId]);

  return {
    currentUserId,
    isLoading,
  };
};
