import { DataRow, getColumnInfo, getDataShape } from '../utils/dataAnalysis';

interface DataInfoProps {
  data: DataRow[];
}

export function DataInfo({ data }: DataInfoProps) {
  if (data.length === 0) return null;

  const shape = getDataShape(data);
  const columns = Object.keys(data[0]);
  const columnInfos = columns.map(col => getColumnInfo(data, col));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Dataset Info (df.info())</h3>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700">
            <span className="font-bold">RangeIndex:</span> {shape.rows} entries, 0 to {shape.rows - 1}
          </p>
          <p className="text-sm font-medium text-gray-700">
            <span className="font-bold">Data columns:</span> {shape.columns} columns
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Column</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Non-Null Count</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Dtype</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Unique</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {columnInfos.map((info, idx) => (
                <tr key={info.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{idx}. {info.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {shape.rows - info.nullCount} non-null
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{info.dtype}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      info.type === 'numerical' ? 'bg-green-100 text-green-800' :
                      info.type === 'binary' ? 'bg-blue-100 text-blue-800' :
                      info.type === 'categorical' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {info.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{info.uniqueCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-bold">Memory usage:</span> {(shape.rows * shape.columns * 8 / 1024).toFixed(2)} KB
          </p>
        </div>
      </div>
    </div>
  );
}
