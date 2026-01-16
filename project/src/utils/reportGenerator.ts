import { DataRow, getColumnInfo, calculateStats, getDataShape, checkDataImbalance } from './dataAnalysis';

export function generateReport(
  datasetName: string,
  data: DataRow[],
  targetColumn?: string
): string {
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

  const numericColumns = columns.filter(col => getColumnInfo(data, col).dtype === 'number');
  const categoricalColumns = columns.filter(col => getColumnInfo(data, col).dtype === 'object');

  let report = `# Dataset Analysis Report: ${datasetName}\n\n`;
  report += `## 1. Dataset Overview\n\n`;
  report += `- **Dataset:** ${datasetName}\n`;
  report += `- **Number of Rows:** ${shape.rows}\n`;
  report += `- **Number of Columns:** ${shape.columns}\n`;
  report += `- **Memory Usage:** ${(shape.rows * shape.columns * 8 / 1024).toFixed(2)} KB\n\n`;

  report += `## 2. Data Types and Structure\n\n`;
  report += `### Column Information:\n\n`;
  report += `| Column | Non-Null Count | Data Type | Feature Type | Unique Values |\n`;
  report += `|--------|----------------|-----------|--------------|---------------|\n`;
  columnInfos.forEach((info, idx) => {
    report += `| ${info.name} | ${shape.rows - info.nullCount} | ${info.dtype} | ${info.type} | ${info.uniqueCount} |\n`;
  });
  report += `\n`;

  report += `### Feature Types Summary:\n`;
  report += `- **Numerical Features:** ${columnInfos.filter(i => i.type === 'numerical').length}\n`;
  report += `- **Categorical Features:** ${columnInfos.filter(i => i.type === 'categorical').length}\n`;
  report += `- **Binary Features:** ${columnInfos.filter(i => i.type === 'binary').length}\n`;
  report += `- **Ordinal Features:** ${columnInfos.filter(i => i.type === 'ordinal').length}\n\n`;

  report += `## 3. Statistical Summary\n\n`;

  if (numericColumns.length > 0) {
    report += `### Numerical Statistics:\n\n`;
    report += `| Statistic | ${numericColumns.join(' | ')} |\n`;
    report += `|-----------|${numericColumns.map(() => '---').join('|')}|\n`;

    ['count', 'mean', 'std', 'min', 'q25', 'q50', 'q75', 'max'].forEach(stat => {
      const values = numericColumns.map(col => {
        const stats = calculateStats(data, col);
        return stats[stat as keyof typeof stats] || '-';
      });
      report += `| ${stat} | ${values.join(' | ')} |\n`;
    });
    report += `\n`;
  }

  report += `## 4. Data Quality Analysis\n\n`;

  report += `### Missing Values:\n`;
  if (columnsWithNulls.length > 0) {
    report += `- **Total Missing Values:** ${totalNulls} (${nullPercentage}% of dataset)\n`;
    report += `- **Columns with Missing Values:**\n`;
    columnsWithNulls.forEach(info => {
      const percentage = ((info.nullCount / shape.rows) * 100).toFixed(1);
      report += `  - ${info.name}: ${info.nullCount} missing (${percentage}%)\n`;
    });
  } else {
    report += `- No missing values detected in the dataset.\n`;
  }
  report += `\n`;

  report += `### Dataset Suitability for Machine Learning:\n`;
  if (isSuitableForML) {
    report += `- Dataset is suitable for machine learning with sufficient rows (${shape.rows}) and features (${shape.columns}).\n`;
  } else {
    report += `- Dataset may be too small for reliable ML models. Consider collecting more data.\n`;
  }
  report += `\n`;

  if (imbalanceInfo && targetColumn) {
    report += `### Target Variable Analysis (${targetColumn}):\n`;
    report += `- **Class Distribution:**\n`;
    Object.entries(imbalanceInfo.distribution).forEach(([label, count]) => {
      const percentage = ((count / shape.rows) * 100).toFixed(1);
      report += `  - ${label}: ${count} (${percentage}%)\n`;
    });
    if (imbalanceInfo.isImbalanced) {
      report += `- **Class Imbalance Detected:** Yes (ratio: ${imbalanceInfo.ratio})\n`;
      report += `- Consider using techniques like SMOTE, class weights, or stratified sampling.\n`;
    } else {
      report += `- **Class Imbalance:** No significant imbalance detected.\n`;
    }
    report += `\n`;
  }

  report += `## 5. Key Observations\n\n`;
  const observations: string[] = [];

  if (columnsWithNulls.length > 0) {
    observations.push(`The dataset contains missing values in ${columnsWithNulls.length} columns, requiring imputation or removal strategies.`);
  }

  if (imbalanceInfo?.isImbalanced) {
    observations.push(`The target variable shows class imbalance, which may require special handling during model training.`);
  }

  if (columnInfos.some(i => i.type === 'categorical' && i.uniqueCount > 10)) {
    observations.push(`Some categorical features have high cardinality, which may need encoding strategies like target encoding.`);
  }

  if (isSuitableForML) {
    observations.push(`The dataset has adequate size for machine learning modeling.`);
  } else {
    observations.push(`Dataset size is limited, which may affect model performance and generalization.`);
  }

  observations.forEach((obs, idx) => {
    report += `${idx + 1}. ${obs}\n`;
  });

  report += `\n## 6. Recommendations\n\n`;
  const recommendations: string[] = [];

  if (columnsWithNulls.length > 0) {
    recommendations.push(`Handle missing values through imputation (mean/median for numerical, mode for categorical) or removal if missingness is substantial.`);
  }

  if (imbalanceInfo?.isImbalanced) {
    recommendations.push(`Address class imbalance using oversampling (SMOTE), undersampling, or class weight adjustments.`);
  }

  recommendations.push(`Perform feature engineering to create more meaningful features from existing ones.`);
  recommendations.push(`Consider feature scaling for numerical features before model training.`);
  recommendations.push(`Split data into training, validation, and test sets with stratification if dealing with classification.`);

  recommendations.forEach((rec, idx) => {
    report += `${idx + 1}. ${rec}\n`;
  });

  report += `\n---\n`;
  report += `*Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*\n`;

  return report;
}

export function downloadReport(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
