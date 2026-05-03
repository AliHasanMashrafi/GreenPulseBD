import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const dataPath = path.join(process.cwd(), 'src/data/dhaka_heat_data.json');

  try {
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json({
      ...data,
      isAutoRefreshing: false,
      dataSource: "Manual Upload"
    });
  } catch (error) {
    return NextResponse.json({ error: 'Data file (dhaka_heat_data.json) not found' }, { status: 500 });
  }
}
