import axios from "axios";

import type { StudentData, StudentListResponse } from "@/types/index.types.js";

interface ApiResponse {
    DATA: string;
    RC: number;
    RCM: string;
}

export const ExternalDataService = {
    DATA_URL: "https://bit.ly/48ejMhW" as const,

    /**
     * Fetch and parse student data from external URL
     */
    async fetchStudentData(): Promise<StudentData[]> {
        try {
            const response = await axios.get<ApiResponse>(this.DATA_URL);

            if (response.status !== 200) {
                throw new Error(
                    `Failed to fetch data: ${response.status.toString()}`,
                );
            }

            const rawData: ApiResponse = response.data;

            // Parse the CSV-like data
            const lines: string[] = rawData.DATA.split("\n");
            const students: StudentData[] = [];

            if (lines.length === 0) {
                throw new Error("No data received from external source");
            }

            // Parse header to determine column order
            const headerLine: string = lines[0].trim();
            const headers: string[] = headerLine
                .split("|")
                .map((h) => h.trim().toUpperCase());

            // Create column mapping
            const columnMap: Record<string, number> = {};
            headers.forEach((header, index) => {
                columnMap[header] = index;
            });

            // Validate required columns exist
            if (
                !("NAMA" in columnMap) ||
                !("NIM" in columnMap) ||
                !("YMD" in columnMap)
            ) {
                throw new Error(
                    "Invalid data format: missing required columns (NAMA, NIM, YMD)",
                );
            }

            const namaIndex = columnMap.NAMA;
            const nimIndex = columnMap.NIM;
            const ymdIndex = columnMap.YMD;

            // Parse data lines
            for (let i = 1; i < lines.length; i++) {
                const line: string = lines[i].trim();
                if (!line) continue;

                const parts: string[] = line.split("|");
                if (parts.length === headers.length) {
                    const student: StudentData = {
                        nama: parts[namaIndex].trim(),
                        nim: parts[nimIndex].trim(),
                        ymd: parts[ymdIndex].trim(),
                    };

                    // Validate data format
                    if (student.nama && student.nim && student.ymd) {
                        students.push(student);
                    }
                }
            }

            // Sort students for consistent ordering (name, then NIM, then YMD)
            students.sort((a, b) => {
                const nameCompare = a.nama.localeCompare(b.nama);
                if (nameCompare !== 0) return nameCompare;

                const nimCompare = a.nim.localeCompare(b.nim);
                if (nimCompare !== 0) return nimCompare;

                return a.ymd.localeCompare(b.ymd);
            });

            return students;
        } catch (error) {
            console.error("Error fetching student data:", error);
            throw new Error(
                "Failed to fetch student data from external source",
            );
        }
    },

    /**
     * Search students by name
     */
    async searchByName(name: string): Promise<StudentData[]> {
        const allStudents = await this.fetchStudentData();
        const filteredStudents = allStudents.filter((student) =>
            student.nama.toLowerCase().includes(name.toLowerCase()),
        );

        // Sort by name for consistent ordering
        filteredStudents.sort((a, b) => a.nama.localeCompare(b.nama));

        return filteredStudents;
    },

    /**
     * Search students by name with pagination
     */
    async searchByNameWithPagination(options: {
        limit?: number;
        nama: string;
        page?: number;
    }): Promise<StudentListResponse> {
        const { limit = 10, nama, page = 1 } = options;

        const allStudents = await this.fetchStudentData();
        const filteredStudents = allStudents.filter((student) =>
            student.nama.toLowerCase().includes(nama.toLowerCase()),
        );

        // Sort by name for consistent ordering
        filteredStudents.sort((a, b) => a.nama.localeCompare(b.nama));

        const totalItems = filteredStudents.length;
        const totalPages = Math.ceil(totalItems / limit);
        const skip = (page - 1) * limit;

        // Apply pagination
        const paginatedStudents = filteredStudents.slice(skip, skip + limit);

        return {
            pagination: {
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                itemsPerPage: limit,
                totalItems,
                totalPages,
            },
            students: paginatedStudents,
        };
    },

    /**
     * Search students by NIM
     */
    async searchByNIM(nim: string): Promise<StudentData[]> {
        const allStudents = await this.fetchStudentData();
        const filteredStudents = allStudents.filter(
            (student) => student.nim === nim,
        );

        // Sort by NIM for consistent ordering
        filteredStudents.sort((a, b) => a.nim.localeCompare(b.nim));

        return filteredStudents;
    },

    /**
     * Search students by YMD
     */
    async searchByYMD(ymd: string): Promise<StudentData[]> {
        const allStudents = await this.fetchStudentData();
        const filteredStudents = allStudents.filter(
            (student) => student.ymd === ymd,
        );

        // Sort by YMD for consistent ordering
        filteredStudents.sort((a, b) => a.ymd.localeCompare(b.ymd));

        return filteredStudents;
    },

    /**
     * Search students by YMD with pagination
     */
    async searchByYMDWithPagination(options: {
        limit?: number;
        page?: number;
        ymd: string;
    }): Promise<StudentListResponse> {
        const { limit = 10, page = 1, ymd } = options;

        const allStudents = await this.fetchStudentData();
        const filteredStudents = allStudents.filter(
            (student) => student.ymd === ymd,
        );

        // Sort by YMD for consistent ordering
        filteredStudents.sort((a, b) => a.ymd.localeCompare(b.ymd));

        const totalItems = filteredStudents.length;
        const totalPages = Math.ceil(totalItems / limit);
        const skip = (page - 1) * limit;

        // Apply pagination
        const paginatedStudents = filteredStudents.slice(skip, skip + limit);

        return {
            pagination: {
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                itemsPerPage: limit,
                totalItems,
                totalPages,
            },
            students: paginatedStudents,
        };
    },
};
