import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface ResumeProps {
  data: ResumeData;
}

const getTemplateStyles = (template: ResumeData['template'], accentColor: string) => {
  const baseStyles = {
    modern: {
      container: 'max-w-4xl mx-auto bg-white p-8 shadow-lg',
      header: 'text-center mb-8',
      name: 'text-4xl font-bold',
      title: 'text-xl mt-2',
      contact: 'flex flex-wrap justify-center gap-4 mt-4 text-sm',
      section: 'mb-6',
      sectionTitle: `text-xl font-semibold border-b-2 pb-1 mb-3`,
      experience: 'mb-4',
      education: 'mb-3',
      skills: 'flex flex-wrap gap-2'
    },
    classic: {
      container: 'max-w-4xl mx-auto bg-white p-8 shadow-lg',
      header: 'border-b-2 pb-4 mb-8',
      name: 'text-3xl font-serif font-bold',
      title: 'text-xl font-serif mt-2',
      contact: 'flex flex-wrap gap-4 mt-4 text-sm',
      section: 'mb-6',
      sectionTitle: `text-xl font-serif font-semibold border-b pb-1 mb-3`,
      experience: 'mb-4',
      education: 'mb-3',
      skills: 'grid grid-cols-3 gap-2'
    },
    minimal: {
      container: 'max-w-4xl mx-auto bg-white p-8 shadow-lg',
      header: 'mb-8',
      name: 'text-3xl font-light',
      title: 'text-xl font-light mt-2',
      contact: 'flex flex-wrap gap-4 mt-4 text-sm',
      section: 'mb-6',
      sectionTitle: `text-lg font-light uppercase tracking-wider pb-1 mb-3`,
      experience: 'mb-4',
      education: 'mb-3',
      skills: 'flex flex-wrap gap-2'
    }
  };

  return {
    ...baseStyles[template],
    sectionTitle: `${baseStyles[template].sectionTitle} border-${accentColor}`,
    accent: `text-${accentColor}`
  };
};

export default function Resume({ data }: ResumeProps) {
  const styles = getTemplateStyles(data.template, data.accentColor);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.name}>{data.fullName}</h1>
        <p className={`${styles.title} ${styles.accent}`}>{data.title}</p>
        <div className={styles.contact}>
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            <span>{data.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            <span>{data.phone}</span>
          </div>
          {data.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{data.location}</span>
            </div>
          )}
          {data.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-4 h-4" />
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className={`hover:${styles.accent}`}>
                LinkedIn
              </a>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <a href={data.website} target="_blank" rel="noopener noreferrer" className={`hover:${styles.accent}`}>
                Website
              </a>
            </div>
          )}
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Professional Summary</h2>
        <p className="text-gray-700 leading-relaxed">{data.summary}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className={styles.experience}>
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
              <p className="text-gray-600 text-sm">
                {exp.startDate} - {exp.endDate}
              </p>
            </div>
            <p className={`text-gray-800 font-medium ${styles.accent}`}>{exp.company}</p>
            <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
              {exp.description.map((desc, i) => (
                <li key={i} className="leading-relaxed">{desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className={styles.education}>
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-medium text-gray-900">{edu.school}</h3>
              <p className="text-gray-600 text-sm">{edu.graduationDate}</p>
            </div>
            <p className="text-gray-800">{edu.degree} in {edu.field}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Skills</h2>
        <div className={styles.skills}>
          {data.skills.map((skill, index) => (
            <span
              key={index}
              className={`bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm ${
                data.template === 'minimal' ? 'border border-gray-200' : ''
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}