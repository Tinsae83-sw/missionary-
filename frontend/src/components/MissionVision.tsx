import React from 'react';

interface MissionVisionProps {
  mission: string;
  vision: string;
  purpose: string;
  coreValues: string;
}

export function MissionVision({ mission, vision, purpose, coreValues }: MissionVisionProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-card p-8 rounded-lg shadow-sm">
        <div className="flex items-center mb-6">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <i className="fas fa-bullseye text-primary text-xl"></i>
          </div>
          <h2 className="text-2xl font-bold">Our Mission</h2>
        </div>
        <p className="text-muted-foreground">{mission}</p>
      </div>

      <div className="bg-card p-8 rounded-lg shadow-sm">
        <div className="flex items-center mb-6">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <i className="fas fa-eye text-primary text-xl"></i>
          </div>
          <h2 className="text-2xl font-bold">Our Vision</h2>
        </div>
        <p className="text-muted-foreground">{vision}</p>
      </div>

      <div className="bg-card p-8 rounded-lg shadow-sm">
        <div className="flex items-center mb-6">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <i className="fas fa-cross text-primary text-xl"></i>
          </div>
          <h2 className="text-2xl font-bold">Our Purpose</h2>
        </div>
        <p className="text-muted-foreground">{purpose}</p>
      </div>

      <div className="bg-card p-8 rounded-lg shadow-sm">
        <div className="flex items-center mb-6">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <i className="fas fa-heart text-primary text-xl"></i>
          </div>
          <h2 className="text-2xl font-bold">Core Values</h2>
        </div>
        <p className="text-muted-foreground">{coreValues}</p>
      </div>
    </div>
  );
}
