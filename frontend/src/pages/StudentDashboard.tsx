import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Star,
  MessageSquare,
  LogOut,
  Plus,
  CheckCircle,
  User,
  Clock,
  Calendar as CalendarIcon,
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
  const [rating, setRating] = useState(7);
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
      setRating(7);
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center flex-shrink-0">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-8 w-8 text-indigo-600" />
                <span className="text-xl font-bold bg-gradient-to-r text-black bg-clip-text text-transparent">
                  VoiceBox
                </span>
              </div>
            </div>

            <div className="hidden sm:flex sm:items-center sm:space-x-6">
              <div className="flex items-center space-x-4 border-gray-200 pl-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-[2px] rounded-xl">
                    <div className="bg-white p-1 rounded-lg">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </span>
                    <span className="text-xs text-gray-500">Student</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <div className="bg-indigo-50 p-2 rounded-lg mr-3">
                    <CalendarIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  Available Sessions
                </h2>
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {format(new Date(), "MMMM yyyy")}
                </span>
              </div>
              <div className="space-y-4">
                {availableSessions.map((session) => (
                  <div
                    key={session.id}
                    className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            Session #{session.id}
                          </span>
                          <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                            Upcoming
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {format(new Date(session.date), "PPP")}
                        </p>
                      </div>
                      {isSessionJoined(session.id) ? (
                        <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-full">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span className="font-medium">Enrolled</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleJoinSession(session.id)}
                          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-200 transform group-hover:scale-105"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Join Session
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {availableSessions.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      No available sessions
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Check back later for new sessions
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <div className="bg-purple-50 p-2 rounded-lg mr-3">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  Your Sessions
                </h2>
                <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  {studentSessions.length} Enrolled
                </span>
              </div>
              <div className="space-y-4">
                {studentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            Session #{session.id}
                          </span>
                          <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {format(new Date(session.date), "PPP")}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-200 transform group-hover:scale-105"
                      >
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Give Feedback
                      </button>
                    </div>
                  </div>
                ))}
                {studentSessions.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Star className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      No enrolled sessions
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Join a session to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectedSession && (
            <div className="bg-white rounded-2xl h-fit shadow-sm p-6 border border-gray-100">
              <div className="border-b border-gray-100 pb-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <div className="bg-purple-50 p-2 rounded-lg mr-3">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                    </div>
                    Submit Feedback
                  </h2>
                  <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    Session #{selectedSession.id}
                  </span>
                </div>
                <p className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {format(new Date(selectedSession.date), "PPPP")}
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rating (1-10)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <button
                        key={value}
                        onClick={() => setRating(value)}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 transform hover:scale-110 ${
                          rating >= value
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-sm"
                            : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <p
                    className="mt-3 text-sm font-medium px-3 py-1 rounded-full inline-block
                    ${rating === 10 ? 'bg-yellow-50 text-yellow-600' :
                      rating >= 8 ? 'bg-green-50 text-green-600' :
                      rating >= 6 ? 'bg-blue-50 text-blue-600' :
                      rating >= 4 ? 'bg-orange-50 text-orange-600' :
                      'bg-red-50 text-red-600'}"
                  >
                    {rating === 10
                      ? "Outstanding!"
                      : rating >= 8
                      ? "Excellent!"
                      : rating >= 6
                      ? "Good"
                      : rating >= 4
                      ? "Fair"
                      : "Needs Improvement"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Your Feedback
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 resize-none"
                    placeholder="Share your thoughts about the session..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitFeedback}
                    className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
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
