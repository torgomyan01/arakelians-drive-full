import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MainTemplate from '@/components/layout/main-template/main-template';
import {
  getSectionBySlug,
  getAllSections,
  RulesSection,
} from '@/utils/rulesSections';
import { SITE_URL } from '@/utils/consts';
import RuleContentRenderer from '@/components/common/rules/RuleContentRenderer';
import RuleSearch from '@/components/common/rules/RuleSearch';

export const dynamicParams = false; // Only generate pages for slugs returned by generateStaticParams
export const revalidate = 3600; // Revalidate every hour

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const sections = getAllSections();
  // Ensure we return all sections
  const params = sections.map((section) => ({
    slug: section.slug,
  }));
  return params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const section = getSectionBySlug(slug);

  if (!section) {
    return {
      title: 'Բաժինը չի գտնվել',
    };
  }

  return {
    title: `${section.title} | Ճանապարհային Կանոններ | xDrive`,
    description: section.description,
    keywords: `ճանապարհային կանոններ, ${section.title}, երթևեկության կանոններ, Հայաստան`,
    openGraph: {
      title: section.title,
      description: section.description,
      type: 'article',
    },
  };
}

export default async function RulesSectionPage({ params }: PageProps) {
  const { slug } = await params;
  const section = getSectionBySlug(slug);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.slug === slug);
  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection =
    currentIndex < allSections.length - 1
      ? allSections[currentIndex + 1]
      : null;

  if (!section) {
    notFound();
  }

  // Format content with proper line breaks and formatting (fallback for simple display)
  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((paragraph, index) => {
        if (paragraph.trim() === '') return null;

        // Check if it's a numbered list item
        if (/^\d+\)/.test(paragraph.trim())) {
          return (
            <div key={index} className="mb-4 pl-6">
              <p className="text-[#222] leading-relaxed">{paragraph.trim()}</p>
            </div>
          );
        }

        // Check if it's a bold title (starts with **)
        if (
          paragraph.trim().startsWith('**') &&
          paragraph.trim().endsWith('**')
        ) {
          const text = paragraph.trim().replace(/\*\*/g, '');
          return (
            <h3
              key={index}
              className="text-xl font-bold text-[#1A2229] mt-8 mb-4"
            >
              {text}
            </h3>
          );
        }

        // Regular paragraph
        return (
          <p key={index} className="text-[#222] leading-relaxed mb-4">
            {paragraph.trim()}
          </p>
        );
      })
      .filter(Boolean);
  };

  return (
    <MainTemplate>
      <div className="container-full pt-[100px] max-w-[1350px] w-full max-[767px]:pt-[90px]">
        <div>
          {/* Breadcrumb */}
          <ul className="flex mb-8 max-[767px]:mb-5 flex-wrap">
            <li>
              <Link
                href={SITE_URL.HOME}
                className="text-[#8D8D8D] text-base hover:text-[#FA8604] transition-colors"
              >
                Գլխաոր էջ
              </Link>
            </li>
            <li>
              <span className="text-[#8D8D8D] text-base mx-1">/</span>
            </li>
            <li>
              <Link
                href="/rules"
                className="text-[#8D8D8D] text-base hover:text-[#FA8604] transition-colors"
              >
                Ճանապարհային Կանոններ
              </Link>
            </li>
            <li>
              <span className="text-[#8D8D8D] text-base mx-1">/</span>
            </li>
            <li>
              <span className="text-[#222] text-base font-semibold">
                {section.title}
              </span>
            </li>
          </ul>

          {/* Section Header */}
          <div className="bg-gradient-to-r from-[#FA8604] to-[#FFA64D] rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between max-[767px]:flex-col max-[767px]:items-start">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold">
                      {section.title.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm opacity-90">
                    Բաժին {section.order}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {section.title}
                </h1>
                <p className="text-lg opacity-95 max-w-3xl">
                  {section.description}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <RuleSearch content={section.content} />
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 md:p-12 mb-8">
            <div className="prose prose-lg max-w-none">
              {/* Use the new RuleContentRenderer for better structure */}
              <RuleContentRenderer content={section.content} />
            </div>
          </div>

          {/* Quick Tips Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A2229] mb-2">
                  Ուսուցողական խորհուրդներ
                </h3>
                <ul className="text-[#222] space-y-2 text-sm">
                  <li>• Կարդացեք յուրաքանչյուր կանոնը ուշադիր</li>
                  <li>
                    • Ուշադրություն դարձրեք կարմիր նշված արգելված կանոններին
                  </li>
                  <li>• Կապույտ նշված կանոնները պարտադիր են</li>
                  <li>
                    • Ընդլայնեք ենթակետերը՝ ավելի մանրամասն տեղեկություն
                    ստանալու համար
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col md:flex-row gap-4 mb-[100px] max-[767px]:mb-8">
            {prevSection ? (
              <Link
                href={`/rules/${prevSection.slug}`}
                className="flex-1 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 hover:border-[#FA8604] group"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#FA8604] rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-[#8D8D8D] mb-1">
                      Նախորդ բաժին
                    </div>
                    <div className="text-lg font-semibold text-[#1A2229] group-hover:text-[#FA8604] transition-colors">
                      {prevSection.title}
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            <Link
              href="/rules"
              className="flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-300 p-6 border border-gray-200"
            >
              <svg
                className="w-6 h-6 text-[#8D8D8D]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <span className="ml-2 text-[#8D8D8D] font-semibold">
                Բոլոր բաժինները
              </span>
            </Link>

            {nextSection ? (
              <Link
                href={`/rules/${nextSection.slug}`}
                className="flex-1 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 hover:border-[#FA8604] group text-right"
              >
                <div className="flex items-center justify-end">
                  <div>
                    <div className="text-sm text-[#8D8D8D] mb-1">
                      Հաջորդ բաժին
                    </div>
                    <div className="text-lg font-semibold text-[#1A2229] group-hover:text-[#FA8604] transition-colors">
                      {nextSection.title}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-[#FA8604] rounded-lg flex items-center justify-center ml-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}
