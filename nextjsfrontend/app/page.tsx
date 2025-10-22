"use client"
import Link from "next/link"
import { BookOpen, Users, BarChart3, Lock } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light-gray to-white">
      {/* Header */}
      <header className="icici-header">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">School ERP System</h1>
          </div>
          <div className="text-sm text-white opacity-90">Professional Management Platform</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-text mb-4">Welcome to School ERP</h2>
          <p className="text-lg text-neutral-dark-gray">Select your portal to continue</p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Link href="/admin/login">
            <div className="icici-card p-8 cursor-pointer group hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-primary to-primary-orange-dark p-4 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-text mb-2">Admin Portal</h3>
              <p className="text-neutral-dark-gray mb-4">Manage school operations, staff, and students</p>
              <div className="text-primary font-semibold group-hover:translate-x-2 transition-transform">
                Access Portal →
              </div>
            </div>
          </Link>

          <Link href="/teacher/login">
            <div className="icici-card p-8 cursor-pointer group hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-secondary to-secondary-burgundy-light p-4 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-text mb-2">Teacher Portal</h3>
              <p className="text-neutral-dark-gray mb-4">Manage classes, attendance, and grades</p>
              <div className="text-secondary font-semibold group-hover:translate-x-2 transition-transform">
                Access Portal →
              </div>
            </div>
          </Link>

          <Link href="/student/login">
            <div className="icici-card p-8 cursor-pointer group hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-accent to-primary p-4 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-text mb-2">Student Portal</h3>
              <p className="text-neutral-dark-gray mb-4">View grades, attendance, and assignments</p>
              <div className="text-accent font-semibold group-hover:translate-x-2 transition-transform">
                Access Portal →
              </div>
            </div>
          </Link>
        </div>

        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
          <h3 className="text-lg font-bold text-neutral-text mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Demo Credentials
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="font-semibold text-neutral-text mb-2">Admin Login</p>
              <p className="text-sm text-neutral-dark-gray">Email: admin@school.com</p>
              <p className="text-sm text-neutral-dark-gray">Password: admin123</p>
            </div>
            <div>
              <p className="font-semibold text-neutral-text mb-2">Teacher Login</p>
              <p className="text-sm text-neutral-dark-gray">Email: teacher@school.com</p>
              <p className="text-sm text-neutral-dark-gray">Password: teacher123</p>
            </div>
            <div>
              <p className="font-semibold text-neutral-text mb-2">Student Login</p>
              <p className="text-sm text-neutral-dark-gray">Email: student@school.com</p>
              <p className="text-sm text-neutral-dark-gray">Password: student123</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-neutral-medium-gray">
          <h3 className="text-2xl font-bold text-neutral-text mb-6">Key Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Student Management", desc: "Complete student information and records" },
              { title: "Attendance Tracking", desc: "Real-time attendance monitoring" },
              { title: "Academic Management", desc: "Grades, assignments, and progress tracking" },
              { title: "Financial Management", desc: "Fee collection and financial reports" },
              { title: "Communication", desc: "SMS and notice board for announcements" },
              { title: "Analytics & Reports", desc: "Comprehensive reporting and analytics" },
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-neutral-text">{feature.title}</h4>
                  <p className="text-sm text-neutral-dark-gray">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-text text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2025 School ERP System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
