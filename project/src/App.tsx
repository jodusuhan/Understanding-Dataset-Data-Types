import { useState } from 'react';
import { Database, FileText, Download, BarChart3 } from 'lucide-react';
import { parseCSV, DataRow } from './utils/dataAnalysis';
import { titanicDataset } from './data/titanicDataset';
import { studentsDataset } from './data/studentsDataset';
import { DataTable } from './components/DataTable';
import { DataInfo } from './components/DataInfo';
import { DataStats } from './components/DataStats';
import { DataQuality } from './components/DataQuality';
import { generateReport, downloadReport } from './utils/reportGenerator';

type DatasetType = 'titanic' | 'students' | null;

function App() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetType>(null);
  const [data, setData] = useState<DataRow[]>([]);
  const [datasetName, setDatasetName] = useState('');
  const [targetColumn, setTargetColumn] = useState('');

  const loadDataset = (type: DatasetType) => {
    if (type === 'titanic') {
      const parsedData = parseCSV(titanicDataset);
      setData(parsedData);
      setDatasetName('Titanic Dataset');
      setTargetColumn('Survived');
      setSelectedDataset(type);
    } else if (type === 'students') {
      const parsedData = parseCSV(studentsDataset);
      setData(parsedData);
      setDatasetName('Students Performance Dataset');
      setTargetColumn('');
      setSelectedDataset(type);
    }
  };

  const handleDownloadReport = () => {
    const report = generateReport(datasetName, data, targetColumn);
    downloadReport(report, `${datasetName.toLowerCase().replace(/\s+/g, '_')}_analysis_report.md`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dataset Analysis Tool</h1>
              <p className="text-sm text-gray-600 mt-1">AI & ML Internship - Task 1: Understanding Dataset & Data Types</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedDataset ? (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Dataset to Analyze</h2>
              <p className="text-gray-600 mb-6">
                Choose one of the datasets below to perform comprehensive data analysis including data types,
                statistics, missing values, and ML readiness assessment.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => loadDataset('titanic')}
                  className="group relative bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 rounded-lg p-6 text-left transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 rounded-lg p-3">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Titanic Dataset</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Classic dataset containing passenger information and survival outcomes from the Titanic disaster.
                      </p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>40 rows</span>
                        <span>12 columns</span>
                        <span>Classification</span>
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => loadDataset('students')}
                  className="group relative bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 rounded-lg p-6 text-left transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-green-600 rounded-lg p-3">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Students Performance Dataset</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Educational dataset with student demographics and test scores across multiple subjects.
                      </p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>40 rows</span>
                        <span>8 columns</span>
                        <span>Regression</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysis Features</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Data Structure</h4>
                    <p className="text-xs text-gray-600 mt-1">View data types, null counts, and feature types</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Statistical Summary</h4>
                    <p className="text-xs text-gray-600 mt-1">Mean, std, quartiles for numerical features</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Quality Analysis</h4>
                    <p className="text-xs text-gray-600 mt-1">Missing values, imbalance, ML suitability</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{datasetName}</h2>
                <p className="text-sm text-gray-600">Comprehensive data analysis and quality assessment</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadReport}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
                <button
                  onClick={() => {
                    setSelectedDataset(null);
                    setData([]);
                    setDatasetName('');
                    setTargetColumn('');
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Change Dataset
                </button>
              </div>
            </div>

            <DataTable data={data} title="First 10 Rows (df.head())" showRows={10} startFrom="head" />

            <DataTable data={data} title="Last 10 Rows (df.tail())" showRows={10} startFrom="tail" />

            <DataInfo data={data} />

            <DataStats data={data} />

            <DataQuality data={data} targetColumn={targetColumn} />

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Interview Questions</h3>
              <div className="space-y-3">
                <details className="group">
                  <summary className="cursor-pointer font-medium text-gray-900 hover:text-blue-600 transition-colors">
                    What is the difference between numerical and categorical data?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 pl-4">
                    Numerical data consists of quantitative values that can be measured and used in mathematical operations (e.g., Age, Fare).
                    Categorical data represents qualitative characteristics and distinct categories (e.g., Sex, Embarked).
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer font-medium text-gray-900 hover:text-blue-600 transition-colors">
                    What is a target variable?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 pl-4">
                    The target variable is the feature we want to predict in machine learning. It's the dependent variable or output.
                    For Titanic, it's "Survived" (whether a passenger survived or not).
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer font-medium text-gray-900 hover:text-blue-600 transition-colors">
                    Why is data understanding important before modeling?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 pl-4">
                    Understanding data helps identify quality issues, choose appropriate algorithms, perform necessary preprocessing,
                    and avoid common pitfalls like data leakage or biased models.
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer font-medium text-gray-900 hover:text-blue-600 transition-colors">
                    What is data imbalance?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 pl-4">
                    Data imbalance occurs when classes in the target variable are not equally represented. This can lead to biased models
                    that favor the majority class.
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer font-medium text-gray-900 hover:text-blue-600 transition-colors">
                    What does df.describe() show?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 pl-4">
                    df.describe() provides statistical summaries including count, mean, standard deviation, min, quartiles (25%, 50%, 75%),
                    and max for numerical features.
                  </p>
                </details>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            AI & ML Internship - Task 1: Understanding Dataset & Data Types
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
