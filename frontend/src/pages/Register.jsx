import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../api/auth';
import { showToast } from '../components/Toast';
import Spinner from '../components/Spinner';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState('MENTEE');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Mentor specific fields
  const [collegeName, setCollegeName] = useState('');
  const [techStack, setTechStack] = useState('');

  // Mentee specific fields
  const [targetSkill, setTargetSkill] = useState('');
  const [currentJobFunction, setCurrentJobFunction] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'MENTOR' || roleParam === 'MENTEE') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please provide a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (role === 'MENTOR') {
      if (!collegeName) newErrors.collegeName = 'College name is required';
      if (!techStack) newErrors.techStack = 'Tech stack is required';
    } else {
      if (!targetSkill) newErrors.targetSkill = 'Target skill is required';
      if (!currentJobFunction) newErrors.currentJobFunction = 'Current job function is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const payload = {
      name,
      email,
      password,
      role,
      ...(role === 'MENTOR' ? { collegeName, techStack } : { targetSkill, currentJobFunction }),
    };

    try {
      const data = await registerApi(payload);
      
      login({
        token: data.token,
        role: data.role,
        email: data.email,
        userId: data.userId,
      });

      showToast('success', 'Account registered successfully!');

      if (data.role === 'MENTOR') {
        navigate('/mentor/dashboard');
      } else if (data.role === 'MENTEE') {
        navigate('/mentee/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        // Fallback for simple message errors (e.g. email already exists)
        setErrors({ email: err.response.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-slate-900">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Or{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-blue-600">
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Role Selector Toggle */}
        <div className="flex bg-slate-100 p-1.5 rounded-lg border border-slate-200">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${
              role === 'MENTEE'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => {
              setRole('MENTEE');
              setErrors({});
            }}
          >
            Mentee
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${
              role === 'MENTOR'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => {
              setRole('MENTOR');
              setErrors({});
            }}
          >
            Mentor
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Common Fields */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                  errors.name ? 'border-danger' : 'border-slate-300'
                } placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                placeholder="John Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: null }));
                }}
              />
              {errors.name && <p className="mt-1 text-xs text-danger font-medium">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-danger' : 'border-slate-300'
                } placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: null }));
                }}
              />
              {errors.email && <p className="mt-1 text-xs text-danger font-medium">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="pass" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="pass"
                type="password"
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-danger' : 'border-slate-300'
                } placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: null }));
                }}
              />
              {errors.password && <p className="mt-1 text-xs text-danger font-medium">{errors.password}</p>}
            </div>

            {/* MENTOR specific fields */}
            {role === 'MENTOR' && (
              <>
                <div>
                  <label htmlFor="college" className="block text-sm font-medium text-slate-700 mb-1">
                    College Name
                  </label>
                  <input
                    id="college"
                    type="text"
                    className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                      errors.collegeName ? 'border-danger' : 'border-slate-300'
                    } placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                    placeholder="IIT Bombay, Delhi University, etc."
                    value={collegeName}
                    onChange={(e) => {
                      setCollegeName(e.target.value);
                      setErrors((prev) => ({ ...prev, collegeName: null }));
                    }}
                  />
                  {errors.collegeName && <p className="mt-1 text-xs text-danger font-medium">{errors.collegeName}</p>}
                </div>

                <div>
                  <label htmlFor="stack" className="block text-sm font-medium text-slate-700 mb-1">
                    Tech Stack / Expertise
                  </label>
                  <input
                    id="stack"
                    type="text"
                    className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                      errors.techStack ? 'border-danger' : 'border-slate-300'
                    } placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                    placeholder="Python, PyTorch, LangChain, React"
                    value={techStack}
                    onChange={(e) => {
                      setTechStack(e.target.value);
                      setErrors((prev) => ({ ...prev, techStack: null }));
                    }}
                  />
                  {errors.techStack && <p className="mt-1 text-xs text-danger font-medium">{errors.techStack}</p>}
                </div>
              </>
            )}

            {/* MENTEE specific fields */}
            {role === 'MENTEE' && (
              <>
                <div>
                  <label htmlFor="target" className="block text-sm font-medium text-slate-700 mb-1">
                    Target AI/ML Skill
                  </label>
                  <input
                    id="target"
                    type="text"
                    className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                      errors.targetSkill ? 'border-danger' : 'border-slate-300'
                    } placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                    placeholder="LLM Fine-tuning, Prompt Eng, Agents"
                    value={targetSkill}
                    onChange={(e) => {
                      setTargetSkill(e.target.value);
                      setErrors((prev) => ({ ...prev, targetSkill: null }));
                    }}
                  />
                  {errors.targetSkill && <p className="mt-1 text-xs text-danger font-medium">{errors.targetSkill}</p>}
                </div>

                <div>
                  <label htmlFor="job" className="block text-sm font-medium text-slate-700 mb-1">
                    Current Job Function / Major
                  </label>
                  <input
                    id="job"
                    type="text"
                    className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                      errors.currentJobFunction ? 'border-danger' : 'border-slate-300'
                    } placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                    placeholder="Computer Science Student, Analyst, Frontend Dev"
                    value={currentJobFunction}
                    onChange={(e) => {
                      setCurrentJobFunction(e.target.value);
                      setErrors((prev) => ({ ...prev, currentJobFunction: null }));
                    }}
                  />
                  {errors.currentJobFunction && <p className="mt-1 text-xs text-danger font-medium">{errors.currentJobFunction}</p>}
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors shadow-md"
            >
              {loading ? <Spinner size="sm" color="text-white" /> : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
