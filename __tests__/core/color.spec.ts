import { Color, Vector4 } from '@galacean/effects-math';

describe('Maths', () => {
  describe('Color', () => {
    // INSTANCING
    it('Instancing', () => {
      // default ctor
      let c = new Color();

      expect(c.r == 0).toEqual(true);
      expect(c.g == 0).toEqual(true);
      expect(c.b == 0).toEqual(true);

      // rgb ctor
      c = new Color(1, 1, 1);
      expect(c.r == 1).toEqual(true);
      expect(c.g == 1).toEqual(true);
      expect(c.b == 1).toEqual(true);

    });

    it('copyFrom', () => {
      const a = new Color();
      const b = new Color(0.5, 0, 0);

      a.copyFrom(b);
      expect(a.equals(b)).toEqual(true);

    });

    it('setZero', () => {
      const c = new Color(1.0, 0.8, 0.6, 0.4);

      expect(c.r).toEqual(1.0);
      expect(c.g).toEqual(0.8);
      expect(c.b).toEqual(0.6);
      expect(c.a).toEqual(0.4);

      c.setZero();
      expect(c.r).toEqual(0);
      expect(c.g).toEqual(0);
      expect(c.b).toEqual(0);
      expect(c.a).toEqual(0);
    });

    it('setHex', () => {
      const c = new Color();

      c.setFromHexString('#FA8072');
      expect(c.toHexString() == '#FA8072FF').toEqual(true);
      expect(c.r == 0xFA / 0xFF).toEqual(true);
      expect(c.g == 0x80 / 0xFF).toEqual(true);
      expect(c.b == 0x72 / 0xFF).toEqual(true);
      expect(c.a == 1).toEqual(true);
    });

    it('setRGB', () => {

      const c = new Color();

      c.set(0.3, 0.5, 0.7, 1.0);

      expect(c.r).toEqual(0.3);
      expect(c.g).toEqual(0.5);
      expect(c.b).toEqual(0.7);

      c.toGamma();

      expect(c.r.toFixed(3)).toEqual('0.584');
      expect(c.g.toFixed(3)).toEqual('0.735');
      expect(c.b.toFixed(3)).toEqual('0.854');

    });

    it('setHSL', () => {
      const c = new Color();

      c.setFromHSV(0.75, 1.0, 0.25);
      const c1 = c.clone().toHSV();

      expect(Math.abs(c1.r - 0.75) < 1e-5).toEqual(true);
      expect(Math.abs(c1.g - 1.00) < 1e-5).toEqual(true);
      expect(Math.abs(c1.b - 0.25) < 1e-5).toEqual(true);

    });

    it('clone', () => {

      const c = Color.MAGENTA;
      const c2 = c.clone();

      expect(c2.equals(c)).toEqual(true);

    });

    it('copyFrom', () => {

      const a = Color.YELLOW;
      const b = new Color();

      b.copyFrom(a);
      expect(a.r == b.r).toEqual(true);
      expect(a.g == b.g).toEqual(true);
      expect(a.b == b.b).toEqual(true);

    });

    it('toLinear', () => {

      const c2 = new Color();

      c2.set(0.3, 0.5, 0.9, 1.0);
      const c = c2.clone().toLinear();

      expect(Math.abs(c.r - 0.07323895587840543) < 1e-5).toEqual(true);
      expect(Math.abs(c.g - 0.21404114048223255) < 1e-5).toEqual(true);
      expect(Math.abs(c.b - 0.7874122893956172) < 1e-5).toEqual(true);
      expect(Math.abs(c.a - 1) < 1e-5).toEqual(true);
    });

    it('toGamma', () => {

      const c2 = new Color();

      c2.set(0.09, 0.25, 0.81, 1.0);
      const c = c2.clone().toGamma();

      expect(Math.abs(c.r - 0.33183623133043544) < 1e-5).toEqual(true);
      expect(Math.abs(c.g - 0.5371042026626895) < 1e-5).toEqual(true);
      expect(Math.abs(c.b - 0.9113219120642658) < 1e-5).toEqual(true);
      expect(Math.abs(c.a - 1.0) < 1e-5).toEqual(true);
    });

    it('toHexString', () => {

      const c = Color.RED;
      const res = c.toHexString();

      expect(res).toEqual('#FF0000FF');

    });

    it('add', () => {

      const a = Color.fromHexString('#0000FF00');
      const b = Color.fromHexString('#FF000000');
      const c = Color.fromHexString('#FF00FF00');

      a.add(b);

      expect(a.equals(c)).toEqual(true);

      a.setFromVector4(new Vector4(0.1, 0.2, 0.3, 0.4));
      a.add([0.3, 0.2, 0.1, 0.0]);
      expect(a.r).toEqual(0.4);
      expect(a.g).toEqual(0.4);
      expect(a.b).toEqual(0.4);
      expect(a.a).toEqual(0.4);
    });

    it('addScalar', () => {
      const a = new Color(0.1, 0.0, 0.0, 0.0);
      const b = new Color(0.6, 0.5, 0.5, 0.5);

      a.add(0.5);

      expect(a.equals(b)).toEqual(true);

    });

    it('sub', () => {
      const a = Color.fromHexString('#0000CC');
      const b = Color.fromHexString('#FF0000');
      const c = Color.fromHexString('#0000AA');

      a.subtract(b);
      expect(a.r).toEqual(-1);
      expect(a.g).toEqual(0);
      expect(a.b).toEqual(0.8);
      expect(a.a).toEqual(0);

      a.setFromHexString('#0000CC');
      a.subtract(c);
      expect(a.r).toEqual(0);
      expect(a.g).toEqual(0);
      expect(a.b).toEqual(0.13333333333333341);
      expect(a.a).toEqual(0);

      a.setFromNumber(1);
      a.subtract(0.4);
      expect(a.r).toEqual(0.6);
      expect(a.g).toEqual(0.6);
      expect(a.b).toEqual(0.6);
      expect(a.a).toEqual(0.6);

      a.setFromNumber(1);
      a.subtract([1, 0.7, 0.4, 0.1]);
      expect(a.r).toEqual(0.0);
      expect(Math.abs(a.g - 0.3) < 1e-5).toEqual(true);
      expect(a.b).toEqual(0.6);
      expect(a.a).toEqual(0.9);
    });

    it('multiply', () => {
      const a = new Color(1, 0, 0.5);
      const b = new Color(0.5, 1, 0.5);
      const c = new Color(0.5, 0, 0.25);

      a.multiply(b);
      expect(a.equals(c)).toEqual(true);

      a.multiply(0.5);
      expect(Math.abs(a.r - 0.25) < 1e-5).toEqual(true);
      expect(Math.abs(a.g - 0) < 1e-5).toEqual(true);
      expect(Math.abs(a.b - 0.125) < 1e-5).toEqual(true);
      expect(Math.abs(a.a - 0) < 1e-5).toEqual(true);

      a.set(1.0, 0.5, 0.7, 0.6);
      a.multiply([0.8, 0.7, 0.6, 0.5]);
      expect(Math.abs(a.r - 0.8) < 1e-5).toEqual(true);
      expect(Math.abs(a.g - 0.35) < 1e-5).toEqual(true);
      expect(Math.abs(a.b - 0.42) < 1e-5).toEqual(true);
      expect(Math.abs(a.a - 0.3) < 1e-5).toEqual(true);
    });

    it('div', () => {
      const a = new Color(1, 0, 0.5, 1.0);
      const b = new Color(0.5, 1, 0.5, 1.0);

      a.divide(b);
      expect(Math.abs(a.r - 2) < 1e-5).toEqual(true);
      expect(Math.abs(a.g - 0) < 1e-5).toEqual(true);
      expect(Math.abs(a.b - 1) < 1e-5).toEqual(true);
      expect(Math.abs(a.a - 1) < 1e-5).toEqual(true);

      a.divide(0.5);
      expect(Math.abs(a.r - 4) < 1e-5).toEqual(true);
      expect(Math.abs(a.g - 0) < 1e-5).toEqual(true);
      expect(Math.abs(a.b - 2) < 1e-5).toEqual(true);
      expect(Math.abs(a.a - 2) < 1e-5).toEqual(true);

      a.set(1.0, 0.5, 0.7, 0.6);
      a.divide([0.8, 0.7, 0.6, 0.5]);
      expect(Math.abs(a.r - 1.25) < 1e-5).toEqual(true);
      expect(Math.abs(a.g - 0.7142857142857143) < 1e-5).toEqual(true);
      expect(Math.abs(a.b - 1.1666666666666667) < 1e-5).toEqual(true);
      expect(Math.abs(a.a - 1.2) < 1e-5).toEqual(true);
    });

    it('lerp', () => {

      const c = new Color();
      const c2 = new Color();

      c.set(1, 0.8, 0.6, 0.4);
      c.lerp(c2, 0.2);
      expect(Math.abs(c.r - 0.8) < 1e-5).toEqual(true);
      expect(Math.abs(c.g - 0.64) < 1e-5).toEqual(true);
      expect(Math.abs(c.b - 0.48) < 1e-5).toEqual(true);
      expect(Math.abs(c.a - 0.32) < 1e-5).toEqual(true);
    });

    it('setElement/getElement', () => {
      const c = new Color(1.0, 0.7, 0.6, 0.3);

      expect(Math.abs(c.getElement(0) - 1.0) < 1e-5).toEqual(true);
      expect(Math.abs(c.getElement(1) - 0.7) < 1e-5).toEqual(true);
      expect(Math.abs(c.getElement(2) - 0.6) < 1e-5).toEqual(true);
      expect(Math.abs(c.getElement(3) - 0.3) < 1e-5).toEqual(true);

      c.setElement(0, 0.2);
      c.setElement(1, 0.5);
      c.setElement(2, 0.7);
      c.setElement(3, 0.9);
      c.setElement(4, 1.0);

      expect(Math.abs(c.getElement(0) - 0.2) < 1e-5).toEqual(true);
      expect(Math.abs(c.getElement(1) - 0.5) < 1e-5).toEqual(true);
      expect(Math.abs(c.getElement(2) - 0.7) < 1e-5).toEqual(true);
      expect(Math.abs(c.getElement(3) - 0.9) < 1e-5).toEqual(true);
    });

    it('equals', () => {

      const a = new Color(0.5, 0.0, 1.0);
      const b = new Color(0.5, 1.0, 0.0);

      expect(a.r).toEqual(b.r);
      expect(a.g).not.toEqual(b.g);
      expect(a.b).not.toEqual(b.b);
      expect(a.a).toEqual(b.a);

      expect(a.equals(b)).not.toEqual(true);
      expect(b.equals(a)).not.toEqual(true);

      a.copyFrom(b);
      expect(a.r).toEqual(b.r);
      expect(a.g).toEqual(b.g);
      expect(a.b).toEqual(b.b);
      expect(a.a).toEqual(b.a);

      expect(a.equals(b)).toEqual(true);
      expect(b.equals(a)).toEqual(true);

    });

    it('from', () => {
      const a = Color.fromNumber(0.3);

      expect(Math.abs(a.r - 0.3) < 1e-5).toEqual(true);
      expect(Math.abs(a.g - 0.3) < 1e-5).toEqual(true);
      expect(Math.abs(a.b - 0.3) < 1e-5).toEqual(true);
      expect(Math.abs(a.a - 0.3) < 1e-5).toEqual(true);

      const b = Color.fromArray([0.1, 0.3, 0.5, 0.7, 0.9]);

      expect(Math.abs(b.r - 0.1) < 1e-5).toEqual(true);
      expect(Math.abs(b.g - 0.3) < 1e-5).toEqual(true);
      expect(Math.abs(b.b - 0.5) < 1e-5).toEqual(true);
      expect(Math.abs(b.a - 0.7) < 1e-5).toEqual(true);
    });

    it('fromArray', () => {
      const a = new Color();
      const array = [0.5, 0.6, 0.7, 0, 1, 0];

      a.setFromArray(array);
      expect(Math.abs(a.r - 0.5) < 1e-5).toEqual(true);
      expect(Math.abs(a.g - 0.6) < 1e-5).toEqual(true);
      expect(Math.abs(a.b - 0.7) < 1e-5).toEqual(true);
      expect(Math.abs(a.a - 0.0) < 1e-5).toEqual(true);

      a.setFromArray(array, 3);
      expect(Math.abs(a.r - 0) < 1e-5).toEqual(true);
      expect(Math.abs(a.g - 1) < 1e-5).toEqual(true);
      expect(Math.abs(a.b - 0) < 1e-5).toEqual(true);
      expect(Math.abs(a.a - 0) < 1e-5).toEqual(true);

    });

    it('toArray', () => {

      const r = 0.5, g = 1.0, b = 0.0, alpha = 0.5;
      const a = new Color(r, g, b, alpha);

      const array = a.toArray();

      expect(Math.abs(array[ 0 ] - r) < 1e-5).toEqual(true);
      expect(Math.abs(array[ 1 ] - g) < 1e-5).toEqual(true);
      expect(Math.abs(array[ 2 ] - b) < 1e-5).toEqual(true);
      expect(Math.abs(array[ 3 ] - alpha) < 1e-5).toEqual(true);

      const array1: any[] = [];

      a.fill(array1);
      expect(Math.abs(array1[ 0 ] - r) < 1e-5).toEqual(true);
      expect(Math.abs(array1[ 1 ] - g) < 1e-5).toEqual(true);
      expect(Math.abs(array1[ 2 ] - b) < 1e-5).toEqual(true);
      expect(Math.abs(array1[ 3 ] - alpha) < 1e-5).toEqual(true);

      const array2: any[] = [];

      a.fill(array2, 1);
      expect(array2[ 0 ]).toEqual(undefined);
      expect(Math.abs(array2[ 1 ] - r) < 1e-5).toEqual(true);
      expect(Math.abs(array2[ 2 ] - g) < 1e-5).toEqual(true);
      expect(Math.abs(array2[ 3 ] - b) < 1e-5).toEqual(true);
      expect(Math.abs(array2[ 4 ] - alpha) < 1e-5).toEqual(true);

    });

  });

});
