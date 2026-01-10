'use client';

import { useEffect, useState } from 'react';
import { getAllTests } from '@/app/actions/tests';
import { SITE_URL } from '@/utils/consts';
import { getTestResult, TestResult } from '@/utils/testStorage';
import Link from 'next/link';

interface Test {
  id: number;
  questionCount: number;
}

interface TestWithResult extends Test {
  result: TestResult | null;
}

export default function TestsContent() {
  const [tests, setTests] = useState<TestWithResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTests() {
      try {
        const fetchedTests = await getAllTests();

        // Get results for each test
        const testsWithResults: TestWithResult[] = fetchedTests.map((test) => {
          const result = getTestResult(test.id, test.questionCount);
          return {
            ...test,
            result,
          };
        });

        setTests(testsWithResults);
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTests();
  }, []);

  const textColorGray = 'text-[#8D8D8D]';
  const glassEffect =
    'rounded-[50px] bg-[rgba(0,0,0,0.08)] backdrop-blur-[4px]';

  return (
    <div className="container-full pt-[100px] max-w-[1350px] w-full max-[767px]:pt-[90px]">
      <div>
        {/* Breadcrumb */}
        <ul className="flex mb-8 max-[767px]:mb-5">
          <li>
            <a href={SITE_URL.HOME} className={`${textColorGray} text-base`}>
              Գլխաոր էջ{' '}
            </a>
          </li>
          <li>
            <span className={`${textColorGray} text-base ml-1`}>/ Թեստեր</span>
          </li>
        </ul>

        <h1 className="global-title mb-[60px] max-[1024px]:mb-8">Թեստեր</h1>

        {isLoading ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-[20px]" />
              ))}
            </div>
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Թեստեր չեն գտնվել
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-[100px] max-[767px]:mb-8 max-[767px]:gap-6">
            {tests.map((test, index) => {
              const isCompleted = test.result?.isCompleted ?? false;
              const isPerfect = test.result?.isPerfect ?? false;
              const percentage = test.result
                ? Math.round((test.result.correct / test.result.total) * 100)
                : 0;

              return (
                <Link
                  key={test.id}
                  href={`${SITE_URL.TESTS}/${test.id}`}
                  className="group relative animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    opacity: 0,
                  }}
                >
                  <div
                    className={`relative h-full rounded-3xl p-6 bg-white/90 backdrop-blur-xl border-2 transition-all duration-500 ease-out cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 ${
                      isCompleted
                        ? isPerfect
                          ? 'border-green-400/60 hover:border-green-500'
                          : 'border-red-400/60 hover:border-red-500'
                        : 'border-[#FA8604]/30 hover:border-[#FA8604]/60'
                    }`}
                  >
                    {/* Animated background gradient */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        isCompleted
                          ? isPerfect
                            ? 'bg-gradient-to-br from-green-50/50 via-transparent to-transparent'
                            : 'bg-gradient-to-br from-red-50/50 via-transparent to-transparent'
                          : 'bg-gradient-to-br from-[#FA8604]/5 via-transparent to-transparent'
                      }`}
                    />

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* Main content */}
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 ${
                              isCompleted
                                ? isPerfect
                                  ? 'bg-gradient-to-br from-green-400 to-green-600'
                                  : 'bg-gradient-to-br from-red-400 to-red-600'
                                : 'bg-gradient-to-br from-[#FA8604] to-[#FF9A3C]'
                            }`}
                          >
                            <i
                              className={`fa-solid text-2xl text-white ${
                                isCompleted
                                  ? isPerfect
                                    ? 'fa-check-circle'
                                    : 'fa-times-circle'
                                  : 'fa-clipboard-question'
                              }`}
                            />
                          </div>
                          <div>
                            <h3
                              className={`text-2xl font-bold mb-1 group-hover:scale-105 transition-transform duration-300 ${
                                isCompleted
                                  ? isPerfect
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                  : 'text-[#222]'
                              }`}
                            >
                              Թեստ {test.id}
                            </h3>
                            <p className="text-xs text-[#8D8D8D] font-medium">
                              {isCompleted ? 'Ավարտված' : 'Նոր թեստ'}
                            </p>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#FA8604]/10 group-hover:bg-[#FA8604] flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                          <i className="fa-solid fa-arrow-right text-[#FA8604] group-hover:text-white transition-all duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>

                      {/* Info section */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 group-hover:bg-gray-50 transition-colors duration-300">
                          <div className="w-8 h-8 rounded-lg bg-[#FA8604]/10 flex items-center justify-center">
                            <i className="fa-solid fa-list-check text-[#FA8604] text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-[#8D8D8D]">
                              Հարցերի քանակ
                            </p>
                            <p className="text-base font-bold text-[#222]">
                              {test.questionCount} հարց
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 group-hover:bg-gray-50 transition-colors duration-300">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <i className="fa-solid fa-clock text-blue-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-[#8D8D8D]">
                              ժամանակահատված
                            </p>
                            <p className="text-base font-bold text-[#222]">
                              30 րոպե
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Results section */}
                      {isCompleted && test.result ? (
                        <div
                          className={`mt-6 p-5 rounded-2xl border-2 backdrop-blur-sm ${
                            isPerfect
                              ? 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-300/50 shadow-lg shadow-green-500/10'
                              : 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-300/50 shadow-lg shadow-red-500/10'
                          }`}
                        >
                          {/* Progress bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-sm font-semibold ${
                                  isPerfect ? 'text-green-700' : 'text-red-700'
                                }`}
                              >
                                Արդյունք
                              </span>
                              <span
                                className={`text-lg font-bold ${
                                  isPerfect ? 'text-green-700' : 'text-red-700'
                                }`}
                              >
                                {percentage}%
                              </span>
                            </div>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                  isPerfect
                                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                                    : 'bg-gradient-to-r from-red-400 to-red-600'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="p-3 rounded-xl bg-white/60">
                              <p className="text-xs text-[#8D8D8D] mb-1">
                                Ճիշտ
                              </p>
                              <p
                                className={`text-xl font-bold ${
                                  isPerfect ? 'text-green-600' : 'text-red-600'
                                }`}
                              >
                                {test.result.correct}
                              </p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/60">
                              <p className="text-xs text-[#8D8D8D] mb-1">
                                Ընդամենը
                              </p>
                              <p className="text-xl font-bold text-[#222]">
                                {test.result.total}
                              </p>
                            </div>
                          </div>

                          {/* Status message */}
                          <div
                            className={`flex items-center gap-2 p-3 rounded-xl ${
                              isPerfect
                                ? 'bg-green-100/50 text-green-700'
                                : 'bg-red-100/50 text-red-700'
                            }`}
                          >
                            <i
                              className={`fa-solid ${
                                isPerfect
                                  ? 'fa-check-circle'
                                  : 'fa-exclamation-circle'
                              }`}
                            />
                            <span className="text-sm font-medium">
                              {isPerfect
                                ? 'Բոլոր հարցերը ճիշտ են'
                                : `${test.result.total - test.result.correct} սխալ պատասխան`}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#FA8604]/5 to-[#FA8604]/10 border border-[#FA8604]/20">
                          <div className="flex items-center gap-3">
                            <i className="fa-solid fa-play-circle text-[#FA8604] text-xl" />
                            <div>
                              <p className="text-sm font-semibold text-[#222]">
                                Սկսել թեստը
                              </p>
                              <p className="text-xs text-[#8D8D8D]">
                                Կտտացրեք սկսելու համար
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
