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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-[100px] max-[767px]:mb-8">
            {tests.map((test) => {
              const isCompleted = test.result?.isCompleted ?? false;
              const isPerfect = test.result?.isPerfect ?? false;
              const borderColor = isCompleted
                ? isPerfect
                  ? 'border-green-500 border-2'
                  : 'border-red-500 border-2'
                : 'border-transparent';

              return (
                <Link
                  key={test.id}
                  href={`${SITE_URL.TESTS}/${test.id}`}
                  className={`${glassEffect} ${borderColor} p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group relative`}
                >
                  {/* Status indicator */}
                  {isCompleted && (
                    <div
                      className={`absolute top-4 right-4 w-4 h-4 rounded-full ${
                        isPerfect ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      title={
                        isPerfect
                          ? 'Բոլոր հարցերը ճիշտ են'
                          : 'Կան սխալ պատասխաններ'
                      }
                    />
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`text-2xl font-bold group-hover:text-[#FA8604] transition-colors ${
                        isCompleted
                          ? isPerfect
                            ? 'text-green-600'
                            : 'text-red-600'
                          : 'text-[#222]'
                      }`}
                    >
                      Թեստ #{test.id}
                    </h3>
                    <i className="fa-solid fa-arrow-right text-[#FA8604] group-hover:translate-x-1 transition-transform"></i>
                  </div>

                  <p className="text-[#8D8D8D] text-base">
                    {test.questionCount} հարց
                  </p>
                  <p className="text-[#8D8D8D] text-sm mt-2">
                    ժամանակահատված: 30 րոպե
                  </p>

                  {/* Results block */}
                  {isCompleted && test.result && (
                    <div
                      className={`mt-4 p-4 rounded-[15px] ${
                        isPerfect
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <div
                        className={`text-lg font-bold mb-1 ${
                          isPerfect ? 'text-green-700' : 'text-red-700'
                        }`}
                      >
                        {test.result.correct} / {test.result.total} ճիշտ
                      </div>
                      <div
                        className={`text-sm ${
                          isPerfect ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {isPerfect
                          ? '✓ Բոլոր հարցերը ճիշտ են'
                          : `✗ ${test.result.total - test.result.correct} սխալ պատասխան`}
                      </div>
                      <div className="text-xs text-[#8D8D8D] mt-2">
                        Թեստը ավարտված է
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
