import React from 'react';
import { Trophy, Gift } from 'lucide-react';

const RewardsProgress = () => {
  const points = 750;
  const nextReward = 1000;
  const progress = (points / nextReward) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Rewards Program</h2>
        <Trophy className="text-primary-600" size={24} />
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-gray-600">{points} points</span>
            <span className="text-gray-600">{nextReward} points</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {nextReward - points} points until your next reward
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Available Rewards</h3>
          <div className="space-y-3">
            {[
              { points: 1000, reward: 'Free Service Week' },
              { points: 2500, reward: 'Premium Upgrade' },
              { points: 5000, reward: 'Month of Free Service' },
            ].map((reward, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <Gift size={16} className="text-primary-600 mr-2" />
                  <span className="text-sm text-gray-900">{reward.reward}</span>
                </div>
                <span className="text-sm font-medium text-primary-600">
                  {reward.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsProgress;