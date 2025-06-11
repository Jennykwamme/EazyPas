
## Admin Panel Features

Admin functionalities are accessible under the '/api/admin' path and require authentication as an admin user.

### Upload Questions via CSV

*   **Endpoint:** 'POST /api/admin/upload-questions-csv'
*   **Description:** Allows administrators to bulk upload BECE questions using a CSV file.
*   **Authentication:** Requires admin privileges.
*   **Request Body:** 'multipart/form-data' with a single file field named 'questionsCsv'.
*   **CSV File Format:**
    The CSV file must have the following headers:
    *   'subject': (String, Required) - The subject of the question (e.g., 'Mathematics', 'English Language').
    *   'year': (Integer, Required) - The year the question is from (e.g., 2023).
    *   'type': (String, Required) - The type of question. Must be either 'objective' or 'theory'.
    *   'questionText': (String, Required) - The main text of the question.
    *   'options': (String, Optional for theory, Required for objective) - A JSON string representing an array of options for objective questions. Example: '"[""Option A"", ""Option B"", ""Option C"", ""Option D""]"'. This entire string, including the outer quotes and escaped inner quotes, should be within a single CSV cell.
    *   'correctAnswer': (String, Required) - The correct answer. For objective questions, this should match one of the options. For theory, it's the model answer.
    *   'solution': (String, Optional) - A detailed solution or explanation for the question.

*   **Success Response (201 Created):**
    ```json
    {
      "message": "CSV processed. Check status for details.",
      "successfullySaved": 50,
      "totalCsvRowsProcessed": 52,
      "csvValidationErrors": [
        { "row": 10, "message": "Invalid type: 'obj'. Must be 'objective' or 'theory'.", "data": { ... } }
      ],
      "databaseSaveErrors": [],
      "warnings": [
        { "row": 15, "message": "Options field was not valid JSON, storing as null.", "originalValue": "[A,B,C]", "error": "Unexpected token A in JSON at position 1"}
      ]
    }
    ```
*   **Error Responses:**
    *   '400 Bad Request': If no file is uploaded, the file is not a CSV, or there are critical CSV validation errors.
    *   '500 Internal Server Error': If database errors occur during saving or stream processing errors.

### List Questions (Admin Review)

*   **Endpoint:** 'GET /api/admin/questions'
*   **Description:** Allows administrators to list and review all questions in the database. Supports pagination, filtering, and sorting.
*   **Authentication:** Requires admin privileges.
*   **Query Parameters:**
    *   'page': (Integer, Optional, Default: 1) - The page number for pagination.
    *   'limit': (Integer, Optional, Default: 10) - The number of questions per page.
    *   'subject': (String, Optional) - Filter by subject (case-insensitive, partial match).
    *   'year': (Integer, Optional) - Filter by year.
    *   'type': (String, Optional) - Filter by type ('objective' or 'theory').
    *   'sort_by': (String, Optional, Default: 'createdAt') - Field to sort by.
    *   'order': (String, Optional, Default: 'DESC') - Sort order ('ASC' or 'DESC').
*   **Success Response (200 OK):**
    ```json
    {
      "totalQuestions": 150,
      "totalPages": 15,
      "currentPage": 1,
      "questions": [
        {
          "id": 1,
          "subject": "Mathematics",
          "year": 2023,
          "type": "objective",
          "questionText": "What is 2+2?",
          "options": ["3", "4", "5"],
          "correctAnswer": "4",
          "solution": "2+2 equals 4.",
          "createdAt": "2023-01-01T12:00:00.000Z",
          "updatedAt": "2023-01-01T12:00:00.000Z"
        }
        // ... more questions
      ]
    }
    ```
