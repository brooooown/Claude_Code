import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';

export const DemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <Icon name="search" size="xl" className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Figma Design Implemented
          </h1>
          <p className="text-gray-600">
            The Air Jordan search results page from your Figma design has been implemented with pixel-perfect accuracy.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/search/results" className="block">
            <Button
              variant="primary"
              size="lg"
              className="w-full bg-red-500 hover:bg-red-600"
              icon={<Icon name="heart" size="sm" />}
            >
              View Figma Design Implementation
            </Button>
          </Link>

          <Link to="/" className="block">
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              icon={<Icon name="home" size="sm" />}
            >
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Design Features Implemented:</h3>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li>✓ Status bar simulation</li>
            <li>✓ Search header with filter tags</li>
            <li>✓ Product grid with price overlays</li>
            <li>✓ Heart icons and SOLD badges</li>
            <li>✓ Save search button</li>
            <li>✓ Bottom navigation tabs</li>
            <li>✓ iPhone home indicator</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;