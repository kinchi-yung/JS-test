const { test, expect } = require('@playwright/test');

test.describe.serial('API-тесты для Restful-booker: CRUD бронирования', () => {
  const baseURL = 'https://restful-booker.herokuapp.com';
  let bookingId;
  let authToken;

  const originalBooking = {
    firstname: 'Иван',
    lastname: 'Петров',
    totalprice: 125,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-12-01',
      checkout: '2026-12-07',
    },
    additionalneeds: 'Breakfast',
  };

  const updatedBooking = {
    firstname: 'Алексей',
    lastname: 'Сидоров',
    totalprice: 175,
    depositpaid: false,
    bookingdates: {
      checkin: '2026-12-10',
      checkout: '2026-12-15',
    },
    additionalneeds: 'Late checkout',
  };

  test('Create: создаёт бронирование', async ({ request }) => {
    const response = await request.post(`${baseURL}/booking`, {
      data: originalBooking,
      headers: { Accept: 'application/json' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('bookingid');
    expect(body.bookingid).toBeTruthy();
    bookingId = body.bookingid;
    expect(body.booking).toEqual(originalBooking);
  });

  test('Read: получает созданное бронирование', async ({ request }) => {
    expect(bookingId).toBeTruthy();

    const response = await request.get(`${baseURL}/booking/${bookingId}`, {
      headers: { Accept: 'application/json' },
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(originalBooking);
  });

  test('Update: обновляет бронирование', async ({ request }) => {
    expect(bookingId).toBeTruthy();

    const authResponse = await request.post(`${baseURL}/auth`, {
      data: { username: 'admin', password: 'password123' },
      headers: { Accept: 'application/json' },
    });
    expect(authResponse.status()).toBe(200);
    authToken = (await authResponse.json()).token;
    expect(authToken).toBeTruthy();

    const response = await request.put(`${baseURL}/booking/${bookingId}`, {
      data: updatedBooking,
      headers: {
        Accept: 'application/json',
        Cookie: `token=${authToken}`,
      },
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(updatedBooking);
  });

  test('Delete: удаляет бронирование и проверяет, что оно больше недоступно', async ({ request }) => {
    expect(bookingId).toBeTruthy();
    expect(authToken).toBeTruthy();

    const deleteResponse = await request.delete(`${baseURL}/booking/${bookingId}`, {
      headers: { Cookie: `token=${authToken}` },
    });
    expect(deleteResponse.status()).toBe(201);

    const getResponse = await request.get(`${baseURL}/booking/${bookingId}`);
    expect(getResponse.status()).toBe(404);
  });
});
