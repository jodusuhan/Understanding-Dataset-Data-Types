import { DataRow } from '../utils/dataAnalysis';

interface DataTableProps {
  data: DataRow[];
  title: string;
  showRows?: number;
  startFrom?: 'head' | 'tail';
}

export function DataTable({ data, title, showRows = 10, startFrom = 'head' }: DataTableProps) {
  if (data.length === 0) return null;

  const displayData = startFrom === 'head'
    ? data.slice(0, showRows)
    : data.slice(-showRows);

  const columns = Object.keys(data[0]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {row[col] === null ? (
                      <span className="text-red-400 italic">null</span>
                    ) : (
                      String(row[col])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        Showing {startFrom === 'head' ? 'first' : 'last'} {displayData.length} of {data.length} rows
      </div>
    </div>
  );
}
