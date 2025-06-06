
import { Link } from 'react-router-dom';
import '../index.css';
const Home = () => {
  return (
    <div className="text-center py-16 px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Course Portal</h1>
      <p className="text-lg mb-8 text-gray-600">
        Access your dashboard, manage courses, and view your profile.
      </p>

      <div className="flex justify-center gap-4">
        <Link to="/login">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
