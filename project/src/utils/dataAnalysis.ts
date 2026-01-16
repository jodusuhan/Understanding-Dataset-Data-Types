export interface DataRow {
  [key: string]: string | number | null;
}

export interface ColumnInfo {
  name: string;
  type: 'numerical' | 'categorical' | 'binary' | 'ordinal';
  dtype: string;
  nullCount: number;
  uniqueCount: number;
}

export interface DataStats {
  count: number;
  mean?: number;
  std?: number;
  min?: number;
  q25?: number;
  q50?: number;
  q75?: number;
  max?: number;
  unique?: number;
  top?: string | number;
  freq?: number;
}

export function inferColumnType(values: (string | number | null)[]): 'numerical' | 'categorical' | 'binary' | 'ordinal' {
  const nonNullValues = values.filter(v => v !== null && v !== '');
  const uniqueValues = new Set(nonNullValues);

  if (uniqueValues.size === 2) {
    return 'binary';
  }

  const numericValues = nonNullValues.filter(v => !isNaN(Number(v)));
  if (numericValues.length === nonNullValues.length && nonNullValues.length > 0) {
    return 'numerical';
  }

  if (uniqueValues.size <= 10 && uniqueValues.size > 2) {
    return 'categorical';
  }

  return 'categorical';
}

export function getColumnInfo(data: DataRow[], columnName: string): ColumnInfo {
  const values = data.map(row => row[columnName]);
  const nonNullValues = values.filter(v => v !== null && v !== '');

  const nullCount = values.length - nonNullValues.length;
  const uniqueCount = new Set(nonNullValues).size;
  const type = inferColumnType(values);

  const numericValues = nonNullValues.filter(v => !isNaN(Number(v)));
  const dtype = numericValues.length === nonNullValues.length && nonNullValues.length > 0
    ? 'number'
    : 'object';

  return {
    name: columnName,
    type,
    dtype,
    nullCount,
    uniqueCount
  };
}

export function calculateStats(data: DataRow[], columnName: string): DataStats {
  const values = data.map(row => row[columnName]);
  const nonNullValues = values.filter(v => v !== null && v !== '');

  const numericValues = nonNullValues
    .map(v => Number(v))
    .filter(v => !isNaN(v));

  if (numericValues.length > 0) {
    const sorted = [...numericValues].sort((a, b) => a - b);
    const sum = numericValues.reduce((a, b) => a + b, 0);
    const mean = sum / numericValues.length;

    const variance = numericValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numericValues.length;
    const std = Math.sqrt(variance);

    const q25Index = Math.floor(sorted.length * 0.25);
    const q50Index = Math.floor(sorted.length * 0.50);
    const q75Index = Math.floor(sorted.length * 0.75);

    return {
      count: numericValues.length,
      mean: parseFloat(mean.toFixed(2)),
      std: parseFloat(std.toFixed(2)),
      min: sorted[0],
      q25: sorted[q25Index],
      q50: sorted[q50Index],
      q75: sorted[q75Index],
      max: sorted[sorted.length - 1]
    };
  } else {
    const frequencyMap = new Map<string | number, number>();
    nonNullValues.forEach(v => {
      const key = String(v);
      frequencyMap.set(key, (frequencyMap.get(key) || 0) + 1);
    });

    let topValue = '';
    let maxFreq = 0;
    frequencyMap.forEach((freq, value) => {
      if (freq > maxFreq) {
        maxFreq = freq;
        topValue = String(value);
      }
    });

    return {
      count: nonNullValues.length,
      unique: new Set(nonNullValues).size,
      top: topValue,
      freq: maxFreq
    };
  }
}

export function parseCSV(csvText: string): DataRow[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  const data: DataRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: DataRow = {};

    headers.forEach((header, index) => {
      const value = values[index];
      if (value === '' || value === 'NA' || value === 'NaN') {
        row[header] = null;
      } else if (!isNaN(Number(value))) {
        row[header] = Number(value);
      } else {
        row[header] = value;
      }
    });

    data.push(row);
  }

  return data;
}

export function getDataShape(data: DataRow[]): { rows: number; columns: number } {
  return {
    rows: data.length,
    columns: data.length > 0 ? Object.keys(data[0]).length : 0
  };
}

export function checkDataImbalance(data: DataRow[], targetColumn: string): {
  isImbalanced: boolean;
  distribution: Record<string, number>;
  ratio: string;
} {
  const values = data.map(row => String(row[targetColumn])).filter(v => v !== 'null');
  const distribution: Record<string, number> = {};

  values.forEach(v => {
    distribution[v] = (distribution[v] || 0) + 1;
  });

  const counts = Object.values(distribution);
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);
  const ratio = `${minCount}:${maxCount}`;

  const isImbalanced = maxCount / minCount > 1.5;

  return { isImbalanced, distribution, ratio };
}
