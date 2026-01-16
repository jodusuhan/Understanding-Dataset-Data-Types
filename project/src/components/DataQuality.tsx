import { DataRow, getColumnInfo, checkDataImbalance, getDataShape } from '../utils/dataAnalysis';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface DataQualityProps {
  data: DataRow[];
  targetColumn?: string;
}

export function DataQuality({ data, targetColumn }: DataQualityProps) {
  if (data.length === 0) return null;

  const shape = getDataShape(data);
  const columns = Object.keys(data[0]);
  const columnInfos = columns.map(col => getColumnInfo(data, col));

  const columnsWithNulls = columnInfos.filter(info => info.nullCount > 0);
  const totalNulls = columnsWithNulls.reduce((sum, info) => sum + info.nullCount, 0);
  const nullPercentage = ((totalNulls / (shape.rows * shape.columns)) * 100).toFixed(2);

  const isSuitableForML = shape.rows >= 30 && shape.columns >= 2;

  let imbalanceInfo = null;
  if (targetColumn && columns.includes(targetColumn)) {
    imbalanceInfo = checkDataImbalance(data, targetColumn);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Quality Analysis</h3>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Dataset Size</h4>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Rows:</span> {shape.rows} | <span className="font-medium">Columns:</span> {shape.columns}
          </p>
          <div className="mt-2 flex items-center gap-2">
            {isSuitableForML ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  Dataset is suitable for machine learning
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-700 font-medium">
                  Dataset may be too small for reliable ML models
                </span>
              </>
            )}
          </div>
        </div>

        <div className={`p-4 rounded-lg ${columnsWithNulls.length > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            {columnsWithNulls.length > 0 ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
            Missing Values
          </h4>
          {columnsWithNulls.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Total missing values:</span> {totalNulls} ({nullPercentage}% of dataset)
              </p>
              <div className="space-y-1">
                {columnsWithNulls.map(info => (
                  <p key={info.name} className="text-sm text-gray-600">
                    <span className="font-medium">{info.name}:</span> {info.nullCount} missing (
                    {((info.nullCount / shape.rows) * 100).toFixed(1)}%)
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-green-700">No missing values found in the dataset</p>
          )}
        </div>

        {imbalanceInfo && (
          <div className={`p-4 rounded-lg ${imbalanceInfo.isImbalanced ? 'bg-yellow-50' : 'bg-green-50'}`}>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              {imbalanceInfo.isImbalanced ? (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              Target Variable Balance ({targetColumn})
            </h4>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Class Distribution:</span>
              </p>
              {Object.entries(imbalanceInfo.distribution).map(([label, count]) => (
                <p key={label} className="text-sm text-gray-600 ml-4">
                  {label}: {count} ({((count / shape.rows) * 100).toFixed(1)}%)
                </p>
              ))}
              {imbalanceInfo.isImbalanced && (
                <p className="text-sm text-yellow-700 font-medium mt-2">
                  Dataset shows class imbalance (ratio: {imbalanceInfo.ratio})
                </p>
              )}
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Feature Types Summary</h4>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Numerical:</span> {columnInfos.filter(i => i.type === 'numerical').length}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Categorical:</span> {columnInfos.filter(i => i.type === 'categorical').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Binary:</span> {columnInfos.filter(i => i.type === 'binary').length}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Ordinal:</span> {columnInfos.filter(i => i.type === 'ordinal').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
