import { DataRow, calculateStats, getColumnInfo } from '../utils/dataAnalysis';

interface DataStatsProps {
  data: DataRow[];
}

export function DataStats({ data }: DataStatsProps) {
  if (data.length === 0) return null;

  const columns = Object.keys(data[0]);
  const numericColumns = columns.filter(col => {
    const info = getColumnInfo(data, col);
    return info.dtype === 'number';
  });

  const categoricalColumns = columns.filter(col => {
    const info = getColumnInfo(data, col);
    return info.dtype === 'object';
  });

  return (
    <div className="space-y-6">
      {numericColumns.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Numerical Statistics (df.describe())
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Statistic</th>
                  {numericColumns.map(col => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {['count', 'mean', 'std', 'min', 'q25', 'q50', 'q75', 'max'].map(stat => (
                  <tr key={stat} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{stat}</td>
                    {numericColumns.map(col => {
                      const stats = calculateStats(data, col);
                      const value = stats[stat as keyof typeof stats];
                      return (
                        <td key={col} className="px-4 py-3 text-sm text-gray-600">
                          {value !== undefined ? value : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {categoricalColumns.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Categorical Statistics
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Statistic</th>
                  {categoricalColumns.map(col => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {['count', 'unique', 'top', 'freq'].map(stat => (
                  <tr key={stat} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{stat}</td>
                    {categoricalColumns.map(col => {
                      const stats = calculateStats(data, col);
                      const value = stats[stat as keyof typeof stats];
                      return (
                        <td key={col} className="px-4 py-3 text-sm text-gray-600">
                          {value !== undefined ? String(value) : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
