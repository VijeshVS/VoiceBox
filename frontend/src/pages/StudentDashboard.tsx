import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Calendar,
  LogOut,
  Star,
  MessageSquare,
  Plus,
  CheckCircle,
} from "lucide-react";
import { sessions } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { Session } from "../types";
import { format } from "date-fns";

function StudentDashboard() {
  const [studentSessions, setStudentSessions] = useState<Session[]>([]);
  const [availableSessions, setAvailableSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    loadSessions();
    loadAvailableSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await sessions.getStudentSessions();
      setStudentSessions(response.data);
    } catch (error) {
      toast.error("Failed to load sessions");
    }
  };

  const loadAvailableSessions = async () => {
    try {
      const response = await sessions.getAllSessions();
      setAvailableSessions(response.data);
    } catch (error) {
      toast.error("Failed to load available sessions");
    }
  };

  const handleJoinSession = async (sessionId: number) => {
    try {
      await sessions.joinSession(sessionId);
      toast.success("Successfully joined session");
      loadSessions();
      loadAvailableSessions();
    } catch (error) {
      toast.error("Failed to join session");
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedSession) return;

    try {
      await sessions.submitFeedback(selectedSession.id, rating, feedback);
      toast.success("Feedback submitted successfully");
      setSelectedSession(null);
      setFeedback("");
      setRating(5);
      loadSessions();
    } catch (error) {
      toast.error("Failed to submit feedback");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isSessionJoined = (sessionId: number) => {
    return studentSessions.some((session) => session.id === sessionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <nav className="shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-black" />
              <span className="ml-2 text-xl font-semibold text-black tracking-wide">
                Student Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLogout}
                className="flex items-center px-5 py-2 text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition duration-200 ease-in-out focus:outline-none"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Available Sessions
              </h2>
              <div className="space-y-4">
                {availableSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">
                          Session #{session.id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(session.date), "PPP")}
                        </p>
                      </div>
                      {isSessionJoined(session.id) ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span>Joined</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleJoinSession(session.id)}
                          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Join Session
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {availableSessions.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No available sessions
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Your Sessions
              </h2>
              <div className="space-y-4">
                {studentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">
                          Session #{session.id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(session.date), "PPP")}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg"
                      >
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Give Feedback
                      </button>
                    </div>
                  </div>
                ))}
                {studentSessions.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    You haven't joined any sessions yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {selectedSession && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Submit Feedback for Session #{selectedSession.id}
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => setRating(value)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          rating >= value ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        <Star className="h-8 w-8" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 resize-none"
                    placeholder="Share your thoughts about the session..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitFeedback}
                    className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg"
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
