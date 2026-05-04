import React from 'react';
import { assets } from '../../assets/assets';
import './Team.css';

const LEADERSHIP = [
  {
    name: 'Sanchu S',
    role: 'Founder / Managing Director',
    bio: '"Driving the brand’s vision to make sustainable living simple and accessible."',
    image: assets.sanchu,
    linkedin: 'https://www.linkedin.com/in/sanchu-s-a6519b392/',
  },
  {
    name: 'Daisy Sanchu',
    role: 'Co-founder / Operations Head',
    bio: '"She leads operations with a hands-on approach, carefully curating products and ensuring that each one aligns with the brand’s eco-friendly values."',
    image: assets.daisy,
    linkedin: '#',
  },
];

const TEAM_MEMBERS = [
  {
    name: 'Ajay',
    role: 'Website Development',
    bio: '"Mastermind Behind Operations"',
    image: assets.ajay,
    linkedin: '#',
  },
  {
    name: 'Pawan Kumar',
    role: 'Business Development / Marketing',
    bio: '"Keeping Our Green Promises Real"',
    image: assets.pawan,
    linkedin: '#',
  },
];

const MemberCard = ({ member }) => (
  <div className="team-member-wrapper">
    {/* 3D Flip Card */}
    <div className="flip-card">
      <div className="flip-card-inner">
        {/* Front: Image */}
        <div className="flip-card-front">
          <img src={member.image} alt={member.name} loading="lazy" />
        </div>
        {/* Back: Info & Quote */}
        <div className="flip-card-back">
          <h3 className="flip-name">{member.name}</h3>
          <p className="flip-role">{member.role}</p>
          <p className="flip-bio">{member.bio}</p>
        </div>
      </div>
    </div>
    {/* LinkedIn Icon */}
    <div className="team-social">
      <a href={member.linkedin} className="linkedin-btn" aria-label="LinkedIn">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      </a>
    </div>
  </div>
);

const Team = () => {
  return (
    <div className="team-page-wrapper">
      <div className="team-container">
        
        {/* Leadership Section */}
        <h2 className="team-section-title">Our Leadership</h2>
        <div className="team-grid">
          {LEADERSHIP.map((member, index) => (
            <MemberCard key={index} member={member} />
          ))}
        </div>

        {/* Team Section */}
        <h2 className="team-section-title" style={{ marginTop: '80px' }}>Our Team</h2>
        <div className="team-grid">
          {TEAM_MEMBERS.map((member, index) => (
            <MemberCard key={index} member={member} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Team;