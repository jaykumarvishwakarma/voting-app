DO
$$
DECLARE
  i INTEGER;
  eid INTEGER;
BEGIN
  FOR i IN 1..100 LOOP
    SELECT id INTO eid FROM "Entity" ORDER BY RANDOM() LIMIT 1;

    INSERT INTO "User" ("username", "password", "name", "phone")
    VALUES (
      'user' || i,
      '$2b$10$NnYAVCW47C2uZjsywDLzquZt/3gXCPyDFcKbEYyrNq6fJcgUsLBKy', -- 'password'
      'User ' || i,
      '99999999' || lpad(i::text, 2, '0')
    );

    INSERT INTO "Vote" ("userId", "entityId")
    SELECT "id", eid FROM "User" WHERE "username" = 'user' || i;
  END LOOP;
END
$$;
