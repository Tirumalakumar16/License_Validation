import React from 'react';

const HomePage = () => {
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  // Sample license images (replace with real ones later)
  const licenseImages = [
    'https://dummyimage.com/300x200/0074D9/ffffff&text=License+Key+1',
    'https://dummyimage.com/300x200/2ECC40/ffffff&text=License+Key+2',
    'https://dummyimage.com/300x200/FF851B/ffffff&text=License+Key+3',
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto">
        {token && (
          <h1 className="mb-4 text-3xl font-bold text-blue-700">
            Welcome, {name}
          </h1>
        )}

        <h2 className="mb-2 text-2xl font-semibold text-gray-800">About License Keys</h2>
        <p className="mb-4 text-gray-700">
          A license key is a unique code that authorizes a user to access or activate a product. In our system, license keys are securely generated and assigned to verified users to control access to mobile or software features. Each license key has metadata such as expiration date, usage logs, and assignment history.
        </p>
        <p className="mb-4 text-gray-700">
          For enterprise customers, bulk license generation and tracking are supported. You can assign license keys, revoke them, or monitor usage — all within the admin dashboard.
        </p>

        {token && (
          <>
            <p className="mb-4 text-gray-700">
              As a logged-in user, you have full access to license management tools. Use the navigation bar to assign new keys, view existing ones, or manage support tickets.
            </p>
          </>
        )}

        <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 md:grid-cols-3">
          {licenseImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`License ${index + 1}`}
              className="border border-gray-200 shadow-lg rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;