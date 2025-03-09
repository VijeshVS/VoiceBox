import { MessageSquare, Shield, Users, BarChart3, ChevronRight, Star, School, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header/Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">VoiceBox</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={()=>navigate('/login')} className="text-gray-600 hover:text-gray-900 px-4 py-2">
                Login
              </button>
              <button onClick={()=>navigate('/register')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Anonymous Feedback Made <span className="text-indigo-600">Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Empower students to provide honest feedback while maintaining their privacy. Create a better learning environment through transparent communication.
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={()=>{navigate('/login')
                toast.info('Please login to get started.')
              }} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center">
                Start Collecting Feedback
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
                <button onClick={() => window.location.href='https://github.com/VijeshVS/VoiceBox'} className="border items-center flex border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition">
                <h1>Github</h1>
                <Github className="ml-2 h-5 w-5" />
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose VoiceBox?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides everything you need to gather and analyze student feedback effectively.
            </p>
          </div>
            <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-indigo-600" />}
              title="Complete Anonymity"
              description="Students can share their thoughts freely without fear of identification."
            />
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8 text-indigo-600" />}
              title="Feedback Display"
              description="View all feedback in an organized and easy-to-read format."
            />
            <FeatureCard
              icon={<Star className="h-8 w-8 text-indigo-600" />}
              title="Average Rating"
              description="See the average rating for each session at a glance."
            />
            </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Educators</h2>
            <div className="flex justify-center items-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join hundreds of educational institutions already using VoiceBox to improve their teaching experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="VoiceBox has transformed how we gather student feedback. The anonymity feature has led to more honest and constructive responses."
              author="Dr. Sarah Johnson"
              role="Professor of Education"
            />
            <TestimonialCard
              quote="The analytics tools are incredible. I can easily track trends and make improvements to my teaching methods."
              author="Mark Thompson"
              role="High School Teacher"
            />
            <TestimonialCard
              quote="Setting up feedback sessions is seamless. Our students love how easy it is to share their thoughts."
              author="Lisa Chen"
              role="Department Head"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of educators who are already improving their teaching through anonymous student feedback.
          </p>
          <button onClick={
            () => {
              navigate('/login')
              toast.info('Please login to create a session.')
            }
          } className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition font-medium">
            Create Your First Session
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <MessageSquare className="h-8 w-8 text-indigo-400" />
                <span className="ml-2 text-xl font-bold text-white">VoiceBox</span>
              </div>
              <p className="text-sm">
                Empowering honest feedback in education.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} VoiceBox. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// @ts-ignore
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// @ts-ignore
function TestimonialCard({ quote, author, role }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
      <School className="h-8 w-8 text-indigo-600 mb-4" />
      <p className="text-gray-600 mb-4 italic">"{quote}"</p>
      <div>
        <p className="font-semibold text-gray-900">{author}</p>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>
    </div>
  );
}

export default LandingPage;