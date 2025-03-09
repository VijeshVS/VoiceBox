import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Users,
  LogOut,
  Plus,
  Star,
  ChevronDown,
  ChevronUp,
  BarChart,
  User,
  Book,
  MessageSquare,
} from "lucide-react";
import { sessions } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { Session, Student, Feedback, SessionRating } from "../types";
import { format } from "date-fns";

function TeacherDashboard() {
  const [teacherSessions, setTeacherSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [noFeedbackStudents, setNoFeedbackStudents] = useState<Student[]>([]);
  const [sessionFeedbacks, setSessionFeedbacks] = useState<Feedback[]>([]);
  const [sessionRating, setSessionRating] = useState<SessionRating | null>(
    null
  );
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [newSessionDate, setNewSessionDate] = useState("");
  const [expandedFeedback, setExpandedFeedback] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await sessions.getTeacherSessions();
      setTeacherSessions(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load sessions");
    }
  };

  const loadSessionDetails = async (sessionId: number) => {
    try {
      const [noFeedbackResponse, feedbackResponse, ratingResponse] =
        await Promise.all([
          sessions.getNoFeedbackStudents(sessionId),
          sessions.getSessionFeedback(sessionId),
          sessions.getSessionRating(sessionId),
        ]);

      setNoFeedbackStudents(noFeedbackResponse.data);
      setSessionFeedbacks(feedbackResponse.data);
      setSessionRating(ratingResponse.data);
    } catch (error) {
      toast.error("Failed to load session details");
    }
  };

  const handleCreateSession = async () => {
    try {
      await sessions.create(newSessionDate);
      toast.success("Session created successfully");
      setShowCreateSession(false);
      setNewSessionDate("");
      loadSessions();
    } catch (error) {
      toast.error("Failed to create session");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleFeedback = (feedbackId: number) => {
    setExpandedFeedback(expandedFeedback === feedbackId ? null : feedbackId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center flex-shrink-0">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-8 w-8 text-indigo-600" />
                <span className="text-xl font-bold bg-gradient-to-r text-black bg-clip-text text-transparent">
                  VoiceBox
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-[2px] rounded-xl">
                  <div className="bg-white p-1 rounded-lg">
                    <Book className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </span>
                  <span className="text-xs text-gray-500">Teacher</span>
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
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Your Sessions
                </h2>
                <button
                  onClick={() => setShowCreateSession(true)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Session
                </button>
              </div>

              {showCreateSession && (
                <div className="mb-6 p-4 border rounded-lg bg-purple-50">
                  <h3 className="font-medium mb-3 text-purple-900">
                    Create New Session
                  </h3>
                  <input
                    type="date"
                    value={newSessionDate}
                    onChange={(e) => setNewSessionDate(e.target.value)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 mb-3"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCreateSession}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowCreateSession(false)}
                      className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {teacherSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`bg-white rounded-lg border p-4 transition-colors duration-200 ${
                      selectedSession?.id === session.id
                        ? "border-purple-300 ring-1 ring-purple-300"
                        : "border-gray-200 hover:border-purple-200"
                    }`}
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
                        onClick={() => {
                          setSelectedSession(session);
                          loadSessionDetails(session.id);
                        }}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                          selectedSession?.id === session.id
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        }`}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
                {teacherSessions.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No sessions created yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {selectedSession && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Session #{selectedSession.id} Overview
                  </h2>
                  {sessionRating && (
                    <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-lg">
                      <BarChart className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="font-medium text-yellow-700">
                        Average Rating:{" "}
                        {sessionRating.totalRating?.toFixed(1) || 0}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="font-medium text-gray-700 mb-3">
                    Students Without Feedback
                  </h3>
                  <div className="space-y-2">
                    {noFeedbackStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center p-3 bg-red-50 rounded-lg"
                      >
                        <Users className="h-5 w-5 text-red-400 mr-3" />
                        <div>
                          <p className="font-medium text-red-700">
                            {student.name}
                          </p>
                          <p className="text-sm text-red-500">
                            Pending Feedback
                          </p>
                        </div>
                      </div>
                    ))}
                    {noFeedbackStudents.length === 0 && (
                      <p className="text-center text-green-600 bg-green-50 p-3 rounded-lg">
                        All students have submitted feedback!
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-3">
                    Feedback Received
                  </h3>
                  <div className="space-y-3">
                    {sessionFeedbacks.map((feedback) => (
                      <div
                        key={feedback.id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleFeedback(feedback.id)}
                        >
                          <div className="flex items-center">
                            <div className="flex space-x-1">
                              {[...Array(feedback.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-5 w-5 text-yellow-400 fill-current"
                                />
                              ))}
                            </div>
                            <span className="ml-3 text-gray-600">
                              Feedback #{feedback.id}
                            </span>
                          </div>
                          {expandedFeedback === feedback.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        {expandedFeedback === feedback.id && (
                          <div className="px-4 pb-4">
                            <p className="text-gray-600 whitespace-pre-wrap">
                              {feedback.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                    {sessionFeedbacks.length === 0 && (
                      <p className="text-center text-gray-500 py-4">
                        No feedback received yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
