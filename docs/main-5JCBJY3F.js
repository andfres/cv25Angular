var sy = Object.defineProperty,
  ay = Object.defineProperties;
var cy = Object.getOwnPropertyDescriptors;
var If = Object.getOwnPropertySymbols;
var ly = Object.prototype.hasOwnProperty,
  uy = Object.prototype.propertyIsEnumerable;
var wf = (e, n, t) =>
    n in e ? sy(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : (e[n] = t),
  C = (e, n) => {
    for (var t in (n ||= {})) ly.call(n, t) && wf(e, t, n[t]);
    if (If) for (var t of If(n)) uy.call(n, t) && wf(e, t, n[t]);
    return e;
  },
  J = (e, n) => ay(e, cy(n));
var wn = (e, n, t) =>
  new Promise((r, o) => {
    var i = (c) => {
        try {
          a(t.next(c));
        } catch (l) {
          o(l);
        }
      },
      s = (c) => {
        try {
          a(t.throw(c));
        } catch (l) {
          o(l);
        }
      },
      a = (c) => (c.done ? r(c.value) : Promise.resolve(c.value).then(i, s));
    a((t = t.apply(e, n)).next());
  });
var uc;
function Mi() {
  return uc;
}
function ut(e) {
  let n = uc;
  return ((uc = e), n);
}
var _f = Symbol('NotFound');
function nr(e) {
  return e === _f || e?.name === '\u0275NotFound';
}
var Te = null,
  Ni = !1,
  dc = 1,
  dy = null,
  xe = Symbol('SIGNAL');
function R(e) {
  let n = Te;
  return ((Te = e), n);
}
function Ri() {
  return Te;
}
var io = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producers: void 0,
  producersTail: void 0,
  consumers: void 0,
  consumersTail: void 0,
  recomputing: !1,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  kind: 'unknown',
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function so(e) {
  if (Ni) throw new Error('');
  if (Te === null) return;
  Te.consumerOnSignalRead(e);
  let n = Te.producersTail;
  if (n !== void 0 && n.producer === e) return;
  let t,
    r = Te.recomputing;
  if (r && ((t = n !== void 0 ? n.nextProducer : Te.producers), t !== void 0 && t.producer === e)) {
    ((Te.producersTail = t), (t.lastReadVersion = e.version));
    return;
  }
  let o = e.consumersTail;
  if (o !== void 0 && o.consumer === Te && (!r || py(o, Te))) return;
  let i = rr(Te),
    s = {
      producer: e,
      consumer: Te,
      nextProducer: t,
      prevConsumer: o,
      lastReadVersion: e.version,
      nextConsumer: void 0,
    };
  ((Te.producersTail = s), n !== void 0 ? (n.nextProducer = s) : (Te.producers = s), i && Nf(e, s));
}
function Tf() {
  dc++;
}
function fc(e) {
  if (!(rr(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === dc)) {
    if (!e.producerMustRecompute(e) && !co(e)) {
      xi(e);
      return;
    }
    (e.producerRecomputeValue(e), xi(e));
  }
}
function pc(e) {
  if (e.consumers === void 0) return;
  let n = Ni;
  Ni = !0;
  try {
    for (let t = e.consumers; t !== void 0; t = t.nextConsumer) {
      let r = t.consumer;
      r.dirty || fy(r);
    }
  } finally {
    Ni = n;
  }
}
function hc() {
  return Te?.consumerAllowSignalWrites !== !1;
}
function fy(e) {
  ((e.dirty = !0), pc(e), e.consumerMarkedDirty?.(e));
}
function xi(e) {
  ((e.dirty = !1), (e.lastCleanEpoch = dc));
}
function ao(e) {
  return (e && Sf(e), R(e));
}
function Sf(e) {
  ((e.producersTail = void 0), (e.recomputing = !0));
}
function Ai(e, n) {
  (R(n), e && Mf(e));
}
function Mf(e) {
  e.recomputing = !1;
  let n = e.producersTail,
    t = n !== void 0 ? n.nextProducer : e.producers;
  if (t !== void 0) {
    if (rr(e))
      do t = gc(t);
      while (t !== void 0);
    n !== void 0 ? (n.nextProducer = void 0) : (e.producers = void 0);
  }
}
function co(e) {
  for (let n = e.producers; n !== void 0; n = n.nextProducer) {
    let t = n.producer,
      r = n.lastReadVersion;
    if (r !== t.version || (fc(t), r !== t.version)) return !0;
  }
  return !1;
}
function lo(e) {
  if (rr(e)) {
    let n = e.producers;
    for (; n !== void 0; ) n = gc(n);
  }
  ((e.producers = void 0),
    (e.producersTail = void 0),
    (e.consumers = void 0),
    (e.consumersTail = void 0));
}
function Nf(e, n) {
  let t = e.consumersTail,
    r = rr(e);
  if (
    (t !== void 0
      ? ((n.nextConsumer = t.nextConsumer), (t.nextConsumer = n))
      : ((n.nextConsumer = void 0), (e.consumers = n)),
    (n.prevConsumer = t),
    (e.consumersTail = n),
    !r)
  )
    for (let o = e.producers; o !== void 0; o = o.nextProducer) Nf(o.producer, o);
}
function gc(e) {
  let n = e.producer,
    t = e.nextProducer,
    r = e.nextConsumer,
    o = e.prevConsumer;
  if (
    ((e.nextConsumer = void 0),
    (e.prevConsumer = void 0),
    r !== void 0 ? (r.prevConsumer = o) : (n.consumersTail = o),
    o !== void 0)
  )
    o.nextConsumer = r;
  else if (((n.consumers = r), !rr(n))) {
    let i = n.producers;
    for (; i !== void 0; ) i = gc(i);
  }
  return t;
}
function rr(e) {
  return e.consumerIsAlwaysLive || e.consumers !== void 0;
}
function mc(e) {
  dy?.(e);
}
function py(e, n) {
  let t = n.producersTail;
  if (t !== void 0) {
    let r = n.producers;
    do {
      if (r === e) return !0;
      if (r === t) break;
      r = r.nextProducer;
    } while (r !== void 0);
  }
  return !1;
}
function vc(e, n) {
  return Object.is(e, n);
}
function hy() {
  throw new Error();
}
var xf = hy;
function Rf(e) {
  xf(e);
}
function yc(e) {
  xf = e;
}
var gy = null;
function Ec(e, n) {
  let t = Object.create(Oi);
  ((t.value = e), n !== void 0 && (t.equal = n));
  let r = () => Af(t);
  return ((r[xe] = t), mc(t), [r, (s) => or(t, s), (s) => Dc(t, s)]);
}
function Af(e) {
  return (so(e), e.value);
}
function or(e, n) {
  (hc() || Rf(e), e.equal(e.value, n) || ((e.value = n), my(e)));
}
function Dc(e, n) {
  (hc() || Rf(e), or(e, n(e.value)));
}
var Oi = J(C({}, io), { equal: vc, value: void 0, kind: 'signal' });
function my(e) {
  (e.version++, Tf(), pc(e), gy?.(e));
}
function O(e) {
  return typeof e == 'function';
}
function ir(e) {
  let t = e((r) => {
    (Error.call(r), (r.stack = new Error().stack));
  });
  return ((t.prototype = Object.create(Error.prototype)), (t.prototype.constructor = t), t);
}
var ki = ir(
  (e) =>
    function (t) {
      (e(this),
        (this.message = t
          ? `${t.length} errors occurred during unsubscription:
${t.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = t));
    },
);
function uo(e, n) {
  if (e) {
    let t = e.indexOf(n);
    0 <= t && e.splice(t, 1);
  }
}
var le = class e {
  constructor(n) {
    ((this.initialTeardown = n),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null));
  }
  unsubscribe() {
    let n;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: t } = this;
      if (t)
        if (((this._parentage = null), Array.isArray(t))) for (let i of t) i.remove(this);
        else t.remove(this);
      let { initialTeardown: r } = this;
      if (O(r))
        try {
          r();
        } catch (i) {
          n = i instanceof ki ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            Of(i);
          } catch (s) {
            ((n = n ?? []), s instanceof ki ? (n = [...n, ...s.errors]) : n.push(s));
          }
      }
      if (n) throw new ki(n);
    }
  }
  add(n) {
    var t;
    if (n && n !== this)
      if (this.closed) Of(n);
      else {
        if (n instanceof e) {
          if (n.closed || n._hasParent(this)) return;
          n._addParent(this);
        }
        (this._finalizers = (t = this._finalizers) !== null && t !== void 0 ? t : []).push(n);
      }
  }
  _hasParent(n) {
    let { _parentage: t } = this;
    return t === n || (Array.isArray(t) && t.includes(n));
  }
  _addParent(n) {
    let { _parentage: t } = this;
    this._parentage = Array.isArray(t) ? (t.push(n), t) : t ? [t, n] : n;
  }
  _removeParent(n) {
    let { _parentage: t } = this;
    t === n ? (this._parentage = null) : Array.isArray(t) && uo(t, n);
  }
  remove(n) {
    let { _finalizers: t } = this;
    (t && uo(t, n), n instanceof e && n._removeParent(this));
  }
};
le.EMPTY = (() => {
  let e = new le();
  return ((e.closed = !0), e);
})();
var Cc = le.EMPTY;
function Pi(e) {
  return e instanceof le || (e && 'closed' in e && O(e.remove) && O(e.add) && O(e.unsubscribe));
}
function Of(e) {
  O(e) ? e() : e.unsubscribe();
}
var tt = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var sr = {
  setTimeout(e, n, ...t) {
    let { delegate: r } = sr;
    return r?.setTimeout ? r.setTimeout(e, n, ...t) : setTimeout(e, n, ...t);
  },
  clearTimeout(e) {
    let { delegate: n } = sr;
    return (n?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function Li(e) {
  sr.setTimeout(() => {
    let { onUnhandledError: n } = tt;
    if (n) n(e);
    else throw e;
  });
}
function fo() {}
var kf = bc('C', void 0, void 0);
function Pf(e) {
  return bc('E', void 0, e);
}
function Lf(e) {
  return bc('N', e, void 0);
}
function bc(e, n, t) {
  return { kind: e, value: n, error: t };
}
var _n = null;
function ar(e) {
  if (tt.useDeprecatedSynchronousErrorHandling) {
    let n = !_n;
    if ((n && (_n = { errorThrown: !1, error: null }), e(), n)) {
      let { errorThrown: t, error: r } = _n;
      if (((_n = null), t)) throw r;
    }
  } else e();
}
function Ff(e) {
  tt.useDeprecatedSynchronousErrorHandling && _n && ((_n.errorThrown = !0), (_n.error = e));
}
var Tn = class extends le {
    constructor(n) {
      (super(),
        (this.isStopped = !1),
        n ? ((this.destination = n), Pi(n) && n.add(this)) : (this.destination = Ey));
    }
    static create(n, t, r) {
      return new xt(n, t, r);
    }
    next(n) {
      this.isStopped ? wc(Lf(n), this) : this._next(n);
    }
    error(n) {
      this.isStopped ? wc(Pf(n), this) : ((this.isStopped = !0), this._error(n));
    }
    complete() {
      this.isStopped ? wc(kf, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed || ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(n) {
      this.destination.next(n);
    }
    _error(n) {
      try {
        this.destination.error(n);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  vy = Function.prototype.bind;
function Ic(e, n) {
  return vy.call(e, n);
}
var _c = class {
    constructor(n) {
      this.partialObserver = n;
    }
    next(n) {
      let { partialObserver: t } = this;
      if (t.next)
        try {
          t.next(n);
        } catch (r) {
          Fi(r);
        }
    }
    error(n) {
      let { partialObserver: t } = this;
      if (t.error)
        try {
          t.error(n);
        } catch (r) {
          Fi(r);
        }
      else Fi(n);
    }
    complete() {
      let { partialObserver: n } = this;
      if (n.complete)
        try {
          n.complete();
        } catch (t) {
          Fi(t);
        }
    }
  },
  xt = class extends Tn {
    constructor(n, t, r) {
      super();
      let o;
      if (O(n) || !n) o = { next: n ?? void 0, error: t ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && tt.useDeprecatedNextContext
          ? ((i = Object.create(n)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: n.next && Ic(n.next, i),
              error: n.error && Ic(n.error, i),
              complete: n.complete && Ic(n.complete, i),
            }))
          : (o = n);
      }
      this.destination = new _c(o);
    }
  };
function Fi(e) {
  tt.useDeprecatedSynchronousErrorHandling ? Ff(e) : Li(e);
}
function yy(e) {
  throw e;
}
function wc(e, n) {
  let { onStoppedNotification: t } = tt;
  t && sr.setTimeout(() => t(e, n));
}
var Ey = { closed: !0, next: fo, error: yy, complete: fo };
var cr = (typeof Symbol == 'function' && Symbol.observable) || '@@observable';
function Be(e) {
  return e;
}
function Tc(...e) {
  return Sc(e);
}
function Sc(e) {
  return e.length === 0
    ? Be
    : e.length === 1
      ? e[0]
      : function (t) {
          return e.reduce((r, o) => o(r), t);
        };
}
var F = (() => {
  class e {
    constructor(t) {
      t && (this._subscribe = t);
    }
    lift(t) {
      let r = new e();
      return ((r.source = this), (r.operator = t), r);
    }
    subscribe(t, r, o) {
      let i = Cy(t) ? t : new xt(t, r, o);
      return (
        ar(() => {
          let { operator: s, source: a } = this;
          i.add(s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i));
        }),
        i
      );
    }
    _trySubscribe(t) {
      try {
        return this._subscribe(t);
      } catch (r) {
        t.error(r);
      }
    }
    forEach(t, r) {
      return (
        (r = jf(r)),
        new r((o, i) => {
          let s = new xt({
            next: (a) => {
              try {
                t(a);
              } catch (c) {
                (i(c), s.unsubscribe());
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(t) {
      var r;
      return (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(t);
    }
    [cr]() {
      return this;
    }
    pipe(...t) {
      return Sc(t)(this);
    }
    toPromise(t) {
      return (
        (t = jf(t)),
        new t((r, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i),
          );
        })
      );
    }
  }
  return ((e.create = (n) => new e(n)), e);
})();
function jf(e) {
  var n;
  return (n = e ?? tt.Promise) !== null && n !== void 0 ? n : Promise;
}
function Dy(e) {
  return e && O(e.next) && O(e.error) && O(e.complete);
}
function Cy(e) {
  return (e && e instanceof Tn) || (Dy(e) && Pi(e));
}
function Mc(e) {
  return O(e?.lift);
}
function V(e) {
  return (n) => {
    if (Mc(n))
      return n.lift(function (t) {
        try {
          return e(t, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError('Unable to lift unknown Observable type');
  };
}
function U(e, n, t, r, o) {
  return new Nc(e, n, t, r, o);
}
var Nc = class extends Tn {
  constructor(n, t, r, o, i, s) {
    (super(n),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = t
        ? function (a) {
            try {
              t(a);
            } catch (c) {
              n.error(c);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (c) {
              n.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              n.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete));
  }
  unsubscribe() {
    var n;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: t } = this;
      (super.unsubscribe(), !t && ((n = this.onFinalize) === null || n === void 0 || n.call(this)));
    }
  }
};
function lr() {
  return V((e, n) => {
    let t = null;
    e._refCount++;
    let r = U(n, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        t = null;
        return;
      }
      let o = e._connection,
        i = t;
      ((t = null), o && (!i || o === i) && o.unsubscribe(), n.unsubscribe());
    });
    (e.subscribe(r), r.closed || (t = e.connect()));
  });
}
var ur = class extends F {
  constructor(n, t) {
    (super(),
      (this.source = n),
      (this.subjectFactory = t),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Mc(n) && (this.lift = n.lift));
  }
  _subscribe(n) {
    return this.getSubject().subscribe(n);
  }
  getSubject() {
    let n = this._subject;
    return ((!n || n.isStopped) && (this._subject = this.subjectFactory()), this._subject);
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: n } = this;
    ((this._subject = this._connection = null), n?.unsubscribe());
  }
  connect() {
    let n = this._connection;
    if (!n) {
      n = this._connection = new le();
      let t = this.getSubject();
      (n.add(
        this.source.subscribe(
          U(
            t,
            void 0,
            () => {
              (this._teardown(), t.complete());
            },
            (r) => {
              (this._teardown(), t.error(r));
            },
            () => this._teardown(),
          ),
        ),
      ),
        n.closed && ((this._connection = null), (n = le.EMPTY)));
    }
    return n;
  }
  refCount() {
    return lr()(this);
  }
};
var Bf = ir(
  (e) =>
    function () {
      (e(this), (this.name = 'ObjectUnsubscribedError'), (this.message = 'object unsubscribed'));
    },
);
var X = (() => {
    class e extends F {
      constructor() {
        (super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null));
      }
      lift(t) {
        let r = new ji(this, this);
        return ((r.operator = t), r);
      }
      _throwIfClosed() {
        if (this.closed) throw new Bf();
      }
      next(t) {
        ar(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers || (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(t);
          }
        });
      }
      error(t) {
        ar(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            ((this.hasError = this.isStopped = !0), (this.thrownError = t));
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(t);
          }
        });
      }
      complete() {
        ar(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: t } = this;
            for (; t.length; ) t.shift().complete();
          }
        });
      }
      unsubscribe() {
        ((this.isStopped = this.closed = !0), (this.observers = this.currentObservers = null));
      }
      get observed() {
        var t;
        return ((t = this.observers) === null || t === void 0 ? void 0 : t.length) > 0;
      }
      _trySubscribe(t) {
        return (this._throwIfClosed(), super._trySubscribe(t));
      }
      _subscribe(t) {
        return (this._throwIfClosed(), this._checkFinalizedStatuses(t), this._innerSubscribe(t));
      }
      _innerSubscribe(t) {
        let { hasError: r, isStopped: o, observers: i } = this;
        return r || o
          ? Cc
          : ((this.currentObservers = null),
            i.push(t),
            new le(() => {
              ((this.currentObservers = null), uo(i, t));
            }));
      }
      _checkFinalizedStatuses(t) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? t.error(o) : i && t.complete();
      }
      asObservable() {
        let t = new F();
        return ((t.source = this), t);
      }
    }
    return ((e.create = (n, t) => new ji(n, t)), e);
  })(),
  ji = class extends X {
    constructor(n, t) {
      (super(), (this.destination = n), (this.source = t));
    }
    next(n) {
      var t, r;
      (r = (t = this.destination) === null || t === void 0 ? void 0 : t.next) === null ||
        r === void 0 ||
        r.call(t, n);
    }
    error(n) {
      var t, r;
      (r = (t = this.destination) === null || t === void 0 ? void 0 : t.error) === null ||
        r === void 0 ||
        r.call(t, n);
    }
    complete() {
      var n, t;
      (t = (n = this.destination) === null || n === void 0 ? void 0 : n.complete) === null ||
        t === void 0 ||
        t.call(n);
    }
    _subscribe(n) {
      var t, r;
      return (r = (t = this.source) === null || t === void 0 ? void 0 : t.subscribe(n)) !== null &&
        r !== void 0
        ? r
        : Cc;
    }
  };
var pe = class extends X {
  constructor(n) {
    (super(), (this._value = n));
  }
  get value() {
    return this.getValue();
  }
  _subscribe(n) {
    let t = super._subscribe(n);
    return (!t.closed && n.next(this._value), t);
  }
  getValue() {
    let { hasError: n, thrownError: t, _value: r } = this;
    if (n) throw t;
    return (this._throwIfClosed(), r);
  }
  next(n) {
    super.next((this._value = n));
  }
};
var xc = {
  now() {
    return (xc.delegate || Date).now();
  },
  delegate: void 0,
};
var Bi = class extends X {
  constructor(n = 1 / 0, t = 1 / 0, r = xc) {
    (super(),
      (this._bufferSize = n),
      (this._windowTime = t),
      (this._timestampProvider = r),
      (this._buffer = []),
      (this._infiniteTimeWindow = !0),
      (this._infiniteTimeWindow = t === 1 / 0),
      (this._bufferSize = Math.max(1, n)),
      (this._windowTime = Math.max(1, t)));
  }
  next(n) {
    let {
      isStopped: t,
      _buffer: r,
      _infiniteTimeWindow: o,
      _timestampProvider: i,
      _windowTime: s,
    } = this;
    (t || (r.push(n), !o && r.push(i.now() + s)), this._trimBuffer(), super.next(n));
  }
  _subscribe(n) {
    (this._throwIfClosed(), this._trimBuffer());
    let t = this._innerSubscribe(n),
      { _infiniteTimeWindow: r, _buffer: o } = this,
      i = o.slice();
    for (let s = 0; s < i.length && !n.closed; s += r ? 1 : 2) n.next(i[s]);
    return (this._checkFinalizedStatuses(n), t);
  }
  _trimBuffer() {
    let { _bufferSize: n, _timestampProvider: t, _buffer: r, _infiniteTimeWindow: o } = this,
      i = (o ? 1 : 2) * n;
    if ((n < 1 / 0 && i < r.length && r.splice(0, r.length - i), !o)) {
      let s = t.now(),
        a = 0;
      for (let c = 1; c < r.length && r[c] <= s; c += 2) a = c;
      a && r.splice(0, a + 1);
    }
  }
};
var Re = new F((e) => e.complete());
function Vf(e) {
  return e && O(e.schedule);
}
function Uf(e) {
  return e[e.length - 1];
}
function Vi(e) {
  return O(Uf(e)) ? e.pop() : void 0;
}
function en(e) {
  return Vf(Uf(e)) ? e.pop() : void 0;
}
function Hf(e, n, t, r) {
  function o(i) {
    return i instanceof t
      ? i
      : new t(function (s) {
          s(i);
        });
  }
  return new (t || (t = Promise))(function (i, s) {
    function a(u) {
      try {
        l(r.next(u));
      } catch (d) {
        s(d);
      }
    }
    function c(u) {
      try {
        l(r.throw(u));
      } catch (d) {
        s(d);
      }
    }
    function l(u) {
      u.done ? i(u.value) : o(u.value).then(a, c);
    }
    l((r = r.apply(e, n || [])).next());
  });
}
function $f(e) {
  var n = typeof Symbol == 'function' && Symbol.iterator,
    t = n && e[n],
    r = 0;
  if (t) return t.call(e);
  if (e && typeof e.length == 'number')
    return {
      next: function () {
        return (e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e });
      },
    };
  throw new TypeError(n ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
}
function Sn(e) {
  return this instanceof Sn ? ((this.v = e), this) : new Sn(e);
}
function zf(e, n, t) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var r = t.apply(e, n || []),
    o,
    i = [];
  return (
    (o = Object.create((typeof AsyncIterator == 'function' ? AsyncIterator : Object).prototype)),
    a('next'),
    a('throw'),
    a('return', s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    return function (m) {
      return Promise.resolve(m).then(f, d);
    };
  }
  function a(f, m) {
    r[f] &&
      ((o[f] = function (_) {
        return new Promise(function (I, D) {
          i.push([f, _, I, D]) > 1 || c(f, _);
        });
      }),
      m && (o[f] = m(o[f])));
  }
  function c(f, m) {
    try {
      l(r[f](m));
    } catch (_) {
      p(i[0][3], _);
    }
  }
  function l(f) {
    f.value instanceof Sn ? Promise.resolve(f.value.v).then(u, d) : p(i[0][2], f);
  }
  function u(f) {
    c('next', f);
  }
  function d(f) {
    c('throw', f);
  }
  function p(f, m) {
    (f(m), i.shift(), i.length && c(i[0][0], i[0][1]));
  }
}
function Gf(e) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var n = e[Symbol.asyncIterator],
    t;
  return n
    ? n.call(e)
    : ((e = typeof $f == 'function' ? $f(e) : e[Symbol.iterator]()),
      (t = {}),
      r('next'),
      r('throw'),
      r('return'),
      (t[Symbol.asyncIterator] = function () {
        return this;
      }),
      t);
  function r(i) {
    t[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, c) {
          ((s = e[i](s)), o(a, c, s.done, s.value));
        });
      };
  }
  function o(i, s, a, c) {
    Promise.resolve(c).then(function (l) {
      i({ value: l, done: a });
    }, s);
  }
}
var Ui = (e) => e && typeof e.length == 'number' && typeof e != 'function';
function $i(e) {
  return O(e?.then);
}
function Hi(e) {
  return O(e[cr]);
}
function zi(e) {
  return Symbol.asyncIterator && O(e?.[Symbol.asyncIterator]);
}
function Gi(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == 'object' ? 'an invalid object' : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function by() {
  return typeof Symbol != 'function' || !Symbol.iterator ? '@@iterator' : Symbol.iterator;
}
var Wi = by();
function qi(e) {
  return O(e?.[Wi]);
}
function Zi(e) {
  return zf(this, arguments, function* () {
    let t = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield Sn(t.read());
        if (o) return yield Sn(void 0);
        yield yield Sn(r);
      }
    } finally {
      t.releaseLock();
    }
  });
}
function Yi(e) {
  return O(e?.getReader);
}
function te(e) {
  if (e instanceof F) return e;
  if (e != null) {
    if (Hi(e)) return Iy(e);
    if (Ui(e)) return wy(e);
    if ($i(e)) return _y(e);
    if (zi(e)) return Wf(e);
    if (qi(e)) return Ty(e);
    if (Yi(e)) return Sy(e);
  }
  throw Gi(e);
}
function Iy(e) {
  return new F((n) => {
    let t = e[cr]();
    if (O(t.subscribe)) return t.subscribe(n);
    throw new TypeError('Provided object does not correctly implement Symbol.observable');
  });
}
function wy(e) {
  return new F((n) => {
    for (let t = 0; t < e.length && !n.closed; t++) n.next(e[t]);
    n.complete();
  });
}
function _y(e) {
  return new F((n) => {
    e.then(
      (t) => {
        n.closed || (n.next(t), n.complete());
      },
      (t) => n.error(t),
    ).then(null, Li);
  });
}
function Ty(e) {
  return new F((n) => {
    for (let t of e) if ((n.next(t), n.closed)) return;
    n.complete();
  });
}
function Wf(e) {
  return new F((n) => {
    My(e, n).catch((t) => n.error(t));
  });
}
function Sy(e) {
  return Wf(Zi(e));
}
function My(e, n) {
  var t, r, o, i;
  return Hf(this, void 0, void 0, function* () {
    try {
      for (t = Gf(e); (r = yield t.next()), !r.done; ) {
        let s = r.value;
        if ((n.next(s), n.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = t.return) && (yield i.call(t));
      } finally {
        if (o) throw o.error;
      }
    }
    n.complete();
  });
}
function Ae(e, n, t, r = 0, o = !1) {
  let i = n.schedule(function () {
    (t(), o ? e.add(this.schedule(null, r)) : this.unsubscribe());
  }, r);
  if ((e.add(i), !o)) return i;
}
function Qi(e, n = 0) {
  return V((t, r) => {
    t.subscribe(
      U(
        r,
        (o) => Ae(r, e, () => r.next(o), n),
        () => Ae(r, e, () => r.complete(), n),
        (o) => Ae(r, e, () => r.error(o), n),
      ),
    );
  });
}
function Ki(e, n = 0) {
  return V((t, r) => {
    r.add(e.schedule(() => t.subscribe(r), n));
  });
}
function qf(e, n) {
  return te(e).pipe(Ki(n), Qi(n));
}
function Zf(e, n) {
  return te(e).pipe(Ki(n), Qi(n));
}
function Yf(e, n) {
  return new F((t) => {
    let r = 0;
    return n.schedule(function () {
      r === e.length ? t.complete() : (t.next(e[r++]), t.closed || this.schedule());
    });
  });
}
function Qf(e, n) {
  return new F((t) => {
    let r;
    return (
      Ae(t, n, () => {
        ((r = e[Wi]()),
          Ae(
            t,
            n,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                t.error(s);
                return;
              }
              i ? t.complete() : t.next(o);
            },
            0,
            !0,
          ));
      }),
      () => O(r?.return) && r.return()
    );
  });
}
function Ji(e, n) {
  if (!e) throw new Error('Iterable cannot be null');
  return new F((t) => {
    Ae(t, n, () => {
      let r = e[Symbol.asyncIterator]();
      Ae(
        t,
        n,
        () => {
          r.next().then((o) => {
            o.done ? t.complete() : t.next(o.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function Kf(e, n) {
  return Ji(Zi(e), n);
}
function Jf(e, n) {
  if (e != null) {
    if (Hi(e)) return qf(e, n);
    if (Ui(e)) return Yf(e, n);
    if ($i(e)) return Zf(e, n);
    if (zi(e)) return Ji(e, n);
    if (qi(e)) return Qf(e, n);
    if (Yi(e)) return Kf(e, n);
  }
  throw Gi(e);
}
function ue(e, n) {
  return n ? Jf(e, n) : te(e);
}
function S(...e) {
  let n = en(e);
  return ue(e, n);
}
function dr(e, n) {
  let t = O(e) ? e : () => e,
    r = (o) => o.error(t());
  return new F(n ? (o) => n.schedule(r, 0, o) : r);
}
function dt(e) {
  return !!e && (e instanceof F || (O(e.lift) && O(e.subscribe)));
}
var Rt = ir(
  (e) =>
    function () {
      (e(this), (this.name = 'EmptyError'), (this.message = 'no elements in sequence'));
    },
);
function A(e, n) {
  return V((t, r) => {
    let o = 0;
    t.subscribe(
      U(r, (i) => {
        r.next(e.call(n, i, o++));
      }),
    );
  });
}
var { isArray: Ny } = Array;
function xy(e, n) {
  return Ny(n) ? e(...n) : e(n);
}
function Xi(e) {
  return A((n) => xy(e, n));
}
var { isArray: Ry } = Array,
  { getPrototypeOf: Ay, prototype: Oy, keys: ky } = Object;
function es(e) {
  if (e.length === 1) {
    let n = e[0];
    if (Ry(n)) return { args: n, keys: null };
    if (Py(n)) {
      let t = ky(n);
      return { args: t.map((r) => n[r]), keys: t };
    }
  }
  return { args: e, keys: null };
}
function Py(e) {
  return e && typeof e == 'object' && Ay(e) === Oy;
}
function ts(e, n) {
  return e.reduce((t, r, o) => ((t[r] = n[o]), t), {});
}
function ns(...e) {
  let n = en(e),
    t = Vi(e),
    { args: r, keys: o } = es(e);
  if (r.length === 0) return ue([], n);
  let i = new F(Ly(r, n, o ? (s) => ts(o, s) : Be));
  return t ? i.pipe(Xi(t)) : i;
}
function Ly(e, n, t = Be) {
  return (r) => {
    Xf(
      n,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          a = o;
        for (let c = 0; c < o; c++)
          Xf(
            n,
            () => {
              let l = ue(e[c], n),
                u = !1;
              l.subscribe(
                U(
                  r,
                  (d) => {
                    ((i[c] = d), u || ((u = !0), a--), a || r.next(t(i.slice())));
                  },
                  () => {
                    --s || r.complete();
                  },
                ),
              );
            },
            r,
          );
      },
      r,
    );
  };
}
function Xf(e, n, t) {
  e ? Ae(t, e, n) : n();
}
function ep(e, n, t, r, o, i, s, a) {
  let c = [],
    l = 0,
    u = 0,
    d = !1,
    p = () => {
      d && !c.length && !l && n.complete();
    },
    f = (_) => (l < r ? m(_) : c.push(_)),
    m = (_) => {
      (i && n.next(_), l++);
      let I = !1;
      te(t(_, u++)).subscribe(
        U(
          n,
          (D) => {
            (o?.(D), i ? f(D) : n.next(D));
          },
          () => {
            I = !0;
          },
          void 0,
          () => {
            if (I)
              try {
                for (l--; c.length && l < r; ) {
                  let D = c.shift();
                  s ? Ae(n, s, () => m(D)) : m(D);
                }
                p();
              } catch (D) {
                n.error(D);
              }
          },
        ),
      );
    };
  return (
    e.subscribe(
      U(n, f, () => {
        ((d = !0), p());
      }),
    ),
    () => {
      a?.();
    }
  );
}
function he(e, n, t = 1 / 0) {
  return O(n)
    ? he((r, o) => A((i, s) => n(r, i, o, s))(te(e(r, o))), t)
    : (typeof n == 'number' && (t = n), V((r, o) => ep(r, o, e, t)));
}
function tp(e = 1 / 0) {
  return he(Be, e);
}
function np() {
  return tp(1);
}
function At(...e) {
  return np()(ue(e, en(e)));
}
function tn(e) {
  return new F((n) => {
    te(e()).subscribe(n);
  });
}
function Rc(...e) {
  let n = Vi(e),
    { args: t, keys: r } = es(e),
    o = new F((i) => {
      let { length: s } = t;
      if (!s) {
        i.complete();
        return;
      }
      let a = new Array(s),
        c = s,
        l = s;
      for (let u = 0; u < s; u++) {
        let d = !1;
        te(t[u]).subscribe(
          U(
            i,
            (p) => {
              (d || ((d = !0), l--), (a[u] = p));
            },
            () => c--,
            void 0,
            () => {
              (!c || !d) && (l || i.next(r ? ts(r, a) : a), i.complete());
            },
          ),
        );
      }
    });
  return n ? o.pipe(Xi(n)) : o;
}
function Oe(e, n) {
  return V((t, r) => {
    let o = 0;
    t.subscribe(U(r, (i) => e.call(n, i, o++) && r.next(i)));
  });
}
function nn(e) {
  return V((n, t) => {
    let r = null,
      o = !1,
      i;
    ((r = n.subscribe(
      U(t, void 0, void 0, (s) => {
        ((i = te(e(s, nn(e)(n)))), r ? (r.unsubscribe(), (r = null), i.subscribe(t)) : (o = !0));
      }),
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(t)));
  });
}
function rp(e, n, t, r, o) {
  return (i, s) => {
    let a = t,
      c = n,
      l = 0;
    i.subscribe(
      U(
        s,
        (u) => {
          let d = l++;
          ((c = a ? e(c, u, d) : ((a = !0), u)), r && s.next(c));
        },
        o &&
          (() => {
            (a && s.next(c), s.complete());
          }),
      ),
    );
  };
}
function ft(e, n) {
  return O(n) ? he(e, n, 1) : he(e, 1);
}
function rn(e) {
  return V((n, t) => {
    let r = !1;
    n.subscribe(
      U(
        t,
        (o) => {
          ((r = !0), t.next(o));
        },
        () => {
          (r || t.next(e), t.complete());
        },
      ),
    );
  });
}
function ke(e) {
  return e <= 0
    ? () => Re
    : V((n, t) => {
        let r = 0;
        n.subscribe(
          U(t, (o) => {
            ++r <= e && (t.next(o), e <= r && t.complete());
          }),
        );
      });
}
function rs(e = Fy) {
  return V((n, t) => {
    let r = !1;
    n.subscribe(
      U(
        t,
        (o) => {
          ((r = !0), t.next(o));
        },
        () => (r ? t.complete() : t.error(e())),
      ),
    );
  });
}
function Fy() {
  return new Rt();
}
function on(e) {
  return V((n, t) => {
    try {
      n.subscribe(t);
    } finally {
      t.add(e);
    }
  });
}
function Ot(e, n) {
  let t = arguments.length >= 2;
  return (r) => r.pipe(e ? Oe((o, i) => e(o, i, r)) : Be, ke(1), t ? rn(n) : rs(() => new Rt()));
}
function fr(e) {
  return e <= 0
    ? () => Re
    : V((n, t) => {
        let r = [];
        n.subscribe(
          U(
            t,
            (o) => {
              (r.push(o), e < r.length && r.shift());
            },
            () => {
              for (let o of r) t.next(o);
              t.complete();
            },
            void 0,
            () => {
              r = null;
            },
          ),
        );
      });
}
function Ac(e, n) {
  let t = arguments.length >= 2;
  return (r) => r.pipe(e ? Oe((o, i) => e(o, i, r)) : Be, fr(1), t ? rn(n) : rs(() => new Rt()));
}
function Oc(e, n) {
  return V(rp(e, n, arguments.length >= 2, !0));
}
function op(e = {}) {
  let {
    connector: n = () => new X(),
    resetOnError: t = !0,
    resetOnComplete: r = !0,
    resetOnRefCountZero: o = !0,
  } = e;
  return (i) => {
    let s,
      a,
      c,
      l = 0,
      u = !1,
      d = !1,
      p = () => {
        (a?.unsubscribe(), (a = void 0));
      },
      f = () => {
        (p(), (s = c = void 0), (u = d = !1));
      },
      m = () => {
        let _ = s;
        (f(), _?.unsubscribe());
      };
    return V((_, I) => {
      (l++, !d && !u && p());
      let D = (c = c ?? n());
      (I.add(() => {
        (l--, l === 0 && !d && !u && (a = kc(m, o)));
      }),
        D.subscribe(I),
        !s &&
          l > 0 &&
          ((s = new xt({
            next: (z) => D.next(z),
            error: (z) => {
              ((d = !0), p(), (a = kc(f, t, z)), D.error(z));
            },
            complete: () => {
              ((u = !0), p(), (a = kc(f, r)), D.complete());
            },
          })),
          te(_).subscribe(s)));
    })(i);
  };
}
function kc(e, n, ...t) {
  if (n === !0) {
    e();
    return;
  }
  if (n === !1) return;
  let r = new xt({
    next: () => {
      (r.unsubscribe(), e());
    },
  });
  return te(n(...t)).subscribe(r);
}
function os(e, n, t) {
  let r,
    o = !1;
  return (
    e && typeof e == 'object'
      ? ({ bufferSize: r = 1 / 0, windowTime: n = 1 / 0, refCount: o = !1, scheduler: t } = e)
      : (r = e ?? 1 / 0),
    op({
      connector: () => new Bi(r, n, t),
      resetOnError: !0,
      resetOnComplete: !1,
      resetOnRefCountZero: o,
    })
  );
}
function Pc(...e) {
  let n = en(e);
  return V((t, r) => {
    (n ? At(e, t, n) : At(e, t)).subscribe(r);
  });
}
function ge(e, n) {
  return V((t, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    t.subscribe(
      U(
        r,
        (c) => {
          o?.unsubscribe();
          let l = 0,
            u = i++;
          te(e(c, u)).subscribe(
            (o = U(
              r,
              (d) => r.next(n ? n(c, d, u, l++) : d),
              () => {
                ((o = null), a());
              },
            )),
          );
        },
        () => {
          ((s = !0), a());
        },
      ),
    );
  });
}
function is(e) {
  return V((n, t) => {
    (te(e).subscribe(U(t, () => t.complete(), fo)), !t.closed && n.subscribe(t));
  });
}
function Ce(e, n, t) {
  let r = O(e) || n || t ? { next: e, error: n, complete: t } : e;
  return r
    ? V((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        o.subscribe(
          U(
            i,
            (c) => {
              var l;
              ((l = r.next) === null || l === void 0 || l.call(r, c), i.next(c));
            },
            () => {
              var c;
              ((a = !1), (c = r.complete) === null || c === void 0 || c.call(r), i.complete());
            },
            (c) => {
              var l;
              ((a = !1), (l = r.error) === null || l === void 0 || l.call(r, c), i.error(c));
            },
            () => {
              var c, l;
              (a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                (l = r.finalize) === null || l === void 0 || l.call(r));
            },
          ),
        );
      })
    : Be;
}
function ip(e) {
  let n = R(null);
  try {
    return e();
  } finally {
    R(n);
  }
}
var us = 'https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss',
  b = class extends Error {
    code;
    constructor(n, t) {
      (super(hr(n, t)), (this.code = n));
    }
  };
function jy(e) {
  return `NG0${Math.abs(e)}`;
}
function hr(e, n) {
  return `${jy(e)}${n ? ': ' + n : ''}`;
}
var Ze = globalThis;
function W(e) {
  for (let n in e) if (e[n] === W) return n;
  throw Error('');
}
function Pt(e) {
  if (typeof e == 'string') return e;
  if (Array.isArray(e)) return `[${e.map(Pt).join(', ')}]`;
  if (e == null) return '' + e;
  let n = e.overriddenName || e.name;
  if (n) return `${n}`;
  let t = e.toString();
  if (t == null) return '' + t;
  let r = t.indexOf(`
`);
  return r >= 0 ? t.slice(0, r) : t;
}
function qc(e, n) {
  return e ? (n ? `${e} ${n}` : e) : n || '';
}
var By = W({ __forward_ref__: W });
function ds(e) {
  return (
    (e.__forward_ref__ = ds),
    (e.toString = function () {
      return Pt(this());
    }),
    e
  );
}
function Pe(e) {
  return Zc(e) ? e() : e;
}
function Zc(e) {
  return typeof e == 'function' && e.hasOwnProperty(By) && e.__forward_ref__ === ds;
}
function w(e) {
  return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
}
function ht(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function mo(e) {
  return Vy(e, fs);
}
function Yc(e) {
  return mo(e) !== null;
}
function Vy(e, n) {
  return (e.hasOwnProperty(n) && e[n]) || null;
}
function Uy(e) {
  let n = e?.[fs] ?? null;
  return n || null;
}
function Fc(e) {
  return e && e.hasOwnProperty(as) ? e[as] : null;
}
var fs = W({ ɵprov: W }),
  as = W({ ɵinj: W }),
  T = class {
    _desc;
    ngMetadataName = 'InjectionToken';
    ɵprov;
    constructor(n, t) {
      ((this._desc = n),
        (this.ɵprov = void 0),
        typeof t == 'number'
          ? (this.__NG_ELEMENT_ID__ = t)
          : t !== void 0 &&
            (this.ɵprov = w({
              token: this,
              providedIn: t.providedIn || 'root',
              factory: t.factory,
            })));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function Qc(e) {
  return e && !!e.ɵproviders;
}
var Kc = W({ ɵcmp: W }),
  Jc = W({ ɵdir: W }),
  Xc = W({ ɵpipe: W }),
  el = W({ ɵmod: W }),
  ho = W({ ɵfac: W }),
  Rn = W({ __NG_ELEMENT_ID__: W }),
  ap = W({ __NG_ENV_ID__: W });
function gr(e) {
  return typeof e == 'string' ? e : e == null ? '' : String(e);
}
function lp(e) {
  return typeof e == 'function'
    ? e.name || e.toString()
    : typeof e == 'object' && e != null && typeof e.type == 'function'
      ? e.type.name || e.type.toString()
      : gr(e);
}
var up = W({ ngErrorCode: W }),
  $y = W({ ngErrorMessage: W }),
  Hy = W({ ngTokenPath: W });
function tl(e, n) {
  return dp('', -200, n);
}
function ps(e, n) {
  throw new b(-201, !1);
}
function dp(e, n, t) {
  let r = new b(n, e);
  return ((r[up] = n), (r[$y] = e), t && (r[Hy] = t), r);
}
function zy(e) {
  return e[up];
}
var jc;
function fp() {
  return jc;
}
function Se(e) {
  let n = jc;
  return ((jc = e), n);
}
function nl(e, n, t) {
  let r = mo(e);
  if (r && r.providedIn == 'root') return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (t & 8) return null;
  if (n !== void 0) return n;
  ps(e, 'Injector');
}
var Gy = {},
  Mn = Gy,
  Wy = '__NG_DI_FLAG__',
  Bc = class {
    injector;
    constructor(n) {
      this.injector = n;
    }
    retrieve(n, t) {
      let r = Nn(t) || 0;
      try {
        return this.injector.get(n, r & 8 ? null : Mn, r);
      } catch (o) {
        if (nr(o)) return o;
        throw o;
      }
    }
  };
function qy(e, n = 0) {
  let t = Mi();
  if (t === void 0) throw new b(-203, !1);
  if (t === null) return nl(e, void 0, n);
  {
    let r = Zy(n),
      o = t.retrieve(e, r);
    if (nr(o)) {
      if (r.optional) return null;
      throw o;
    }
    return o;
  }
}
function M(e, n = 0) {
  return (fp() || qy)(Pe(e), n);
}
function h(e, n) {
  return M(e, Nn(n));
}
function Nn(e) {
  return typeof e > 'u' || typeof e == 'number'
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function Zy(e) {
  return { optional: !!(e & 8), host: !!(e & 1), self: !!(e & 2), skipSelf: !!(e & 4) };
}
function Vc(e) {
  let n = [];
  for (let t = 0; t < e.length; t++) {
    let r = Pe(e[t]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new b(900, !1);
      let o,
        i = 0;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = Yy(a);
        typeof c == 'number' ? (c === -1 ? (o = a.token) : (i |= c)) : (o = a);
      }
      n.push(M(o, i));
    } else n.push(M(r));
  }
  return n;
}
function Yy(e) {
  return e[Wy];
}
function sn(e, n) {
  let t = e.hasOwnProperty(ho);
  return t ? e[ho] : null;
}
function hs(e, n) {
  e.forEach((t) => (Array.isArray(t) ? hs(t, n) : n(t)));
}
function rl(e, n, t) {
  n >= e.length ? e.push(t) : e.splice(n, 0, t);
}
function vo(e, n) {
  return n >= e.length - 1 ? e.pop() : e.splice(n, 1)[0];
}
function pp(e, n, t, r) {
  let o = e.length;
  if (o == n) e.push(t, r);
  else if (o === 1) (e.push(r, e[0]), (e[0] = t));
  else {
    for (o--, e.push(e[o - 1], e[o]); o > n; ) {
      let i = o - 2;
      ((e[o] = e[i]), o--);
    }
    ((e[n] = t), (e[n + 1] = r));
  }
}
function hp(e, n, t) {
  let r = mr(e, n);
  return (r >= 0 ? (e[r | 1] = t) : ((r = ~r), pp(e, r, n, t)), r);
}
function gs(e, n) {
  let t = mr(e, n);
  if (t >= 0) return e[t | 1];
}
function mr(e, n) {
  return Qy(e, n, 1);
}
function Qy(e, n, t) {
  let r = 0,
    o = e.length >> t;
  for (; o !== r; ) {
    let i = r + ((o - r) >> 1),
      s = e[i << t];
    if (n === s) return i << t;
    s > n ? (o = i) : (r = i + 1);
  }
  return ~(o << t);
}
var An = {},
  qe = [],
  Lt = new T(''),
  ol = new T('', -1),
  il = new T(''),
  go = class {
    get(n, t = Mn) {
      if (t === Mn) {
        let o = dp('', -201);
        throw ((o.name = '\u0275NotFound'), o);
      }
      return t;
    }
  };
function sl(e) {
  return e[el] || null;
}
function ln(e) {
  return e[Kc] || null;
}
function al(e) {
  return e[Jc] || null;
}
function gp(e) {
  return e[Xc] || null;
}
function On(e) {
  return { ɵproviders: e };
}
function yo(...e) {
  return { ɵproviders: cl(!0, e), ɵfromNgModule: !0 };
}
function cl(e, ...n) {
  let t = [],
    r = new Set(),
    o,
    i = (s) => {
      t.push(s);
    };
  return (
    hs(n, (s) => {
      let a = s;
      cs(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && mp(o, i),
    t
  );
}
function mp(e, n) {
  for (let t = 0; t < e.length; t++) {
    let { ngModule: r, providers: o } = e[t];
    ll(o, (i) => {
      n(i, r);
    });
  }
}
function cs(e, n, t, r) {
  if (((e = Pe(e)), !e)) return !1;
  let o = null,
    i = Fc(e),
    s = !i && ln(e);
  if (!i && !s) {
    let c = e.ngModule;
    if (((i = Fc(c)), i)) o = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return !1;
    if ((r.add(o), s.dependencies)) {
      let c = typeof s.dependencies == 'function' ? s.dependencies() : s.dependencies;
      for (let l of c) cs(l, n, t, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let l;
      try {
        hs(i.imports, (u) => {
          cs(u, n, t, r) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && mp(l, n);
    }
    if (!a) {
      let l = sn(o) || (() => new o());
      (n({ provide: o, useFactory: l, deps: qe }, o),
        n({ provide: il, useValue: o, multi: !0 }, o),
        n({ provide: Lt, useValue: () => M(o), multi: !0 }, o));
    }
    let c = i.providers;
    if (c != null && !a) {
      let l = e;
      ll(c, (u) => {
        n(u, l);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function ll(e, n) {
  for (let t of e) (Qc(t) && (t = t.ɵproviders), Array.isArray(t) ? ll(t, n) : n(t));
}
var Ky = W({ provide: String, useValue: W });
function vp(e) {
  return e !== null && typeof e == 'object' && Ky in e;
}
function Jy(e) {
  return !!(e && e.useExisting);
}
function Xy(e) {
  return !!(e && e.useFactory);
}
function ls(e) {
  return typeof e == 'function';
}
var Eo = new T(''),
  ss = {},
  cp = {},
  Lc;
function Do() {
  return (Lc === void 0 && (Lc = new go()), Lc);
}
var me = class {},
  xn = class extends me {
    parent;
    source;
    scopes;
    records = new Map();
    _ngOnDestroyHooks = new Set();
    _onDestroyHooks = [];
    get destroyed() {
      return this._destroyed;
    }
    _destroyed = !1;
    injectorDefTypes;
    constructor(n, t, r, o) {
      (super(),
        (this.parent = t),
        (this.source = r),
        (this.scopes = o),
        $c(n, (s) => this.processProvider(s)),
        this.records.set(ol, pr(void 0, this)),
        o.has('environment') && this.records.set(me, pr(void 0, this)));
      let i = this.records.get(Eo);
      (i != null && typeof i.value == 'string' && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(il, qe, { self: !0 }))));
    }
    retrieve(n, t) {
      let r = Nn(t) || 0;
      try {
        return this.get(n, Mn, r);
      } catch (o) {
        if (nr(o)) return o;
        throw o;
      }
    }
    destroy() {
      (po(this), (this._destroyed = !0));
      let n = R(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let t = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of t) r();
      } finally {
        (this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), R(n));
      }
    }
    onDestroy(n) {
      return (po(this), this._onDestroyHooks.push(n), () => this.removeOnDestroy(n));
    }
    runInContext(n) {
      po(this);
      let t = ut(this),
        r = Se(void 0),
        o;
      try {
        return n();
      } finally {
        (ut(t), Se(r));
      }
    }
    get(n, t = Mn, r) {
      if ((po(this), n.hasOwnProperty(ap))) return n[ap](this);
      let o = Nn(r),
        i,
        s = ut(this),
        a = Se(void 0);
      try {
        if (!(o & 4)) {
          let l = this.records.get(n);
          if (l === void 0) {
            let u = oE(n) && mo(n);
            (u && this.injectableDefInScope(u) ? (l = pr(Uc(n), ss)) : (l = null),
              this.records.set(n, l));
          }
          if (l != null) return this.hydrate(n, l, o);
        }
        let c = o & 2 ? Do() : this.parent;
        return ((t = o & 8 && t === Mn ? null : t), c.get(n, t));
      } catch (c) {
        let l = zy(c);
        throw l === -200 || l === -201 ? new b(l, null) : c;
      } finally {
        (Se(a), ut(s));
      }
    }
    resolveInjectorInitializers() {
      let n = R(null),
        t = ut(this),
        r = Se(void 0),
        o;
      try {
        let i = this.get(Lt, qe, { self: !0 });
        for (let s of i) s();
      } finally {
        (ut(t), Se(r), R(n));
      }
    }
    toString() {
      let n = [],
        t = this.records;
      for (let r of t.keys()) n.push(Pt(r));
      return `R3Injector[${n.join(', ')}]`;
    }
    processProvider(n) {
      n = Pe(n);
      let t = ls(n) ? n : Pe(n && n.provide),
        r = tE(n);
      if (!ls(n) && n.multi === !0) {
        let o = this.records.get(t);
        (o || ((o = pr(void 0, ss, !0)), (o.factory = () => Vc(o.multi)), this.records.set(t, o)),
          (t = n),
          o.multi.push(n));
      }
      this.records.set(t, r);
    }
    hydrate(n, t, r) {
      let o = R(null);
      try {
        if (t.value === cp) throw tl(Pt(n));
        return (
          t.value === ss && ((t.value = cp), (t.value = t.factory(void 0, r))),
          typeof t.value == 'object' &&
            t.value &&
            rE(t.value) &&
            this._ngOnDestroyHooks.add(t.value),
          t.value
        );
      } finally {
        R(o);
      }
    }
    injectableDefInScope(n) {
      if (!n.providedIn) return !1;
      let t = Pe(n.providedIn);
      return typeof t == 'string'
        ? t === 'any' || this.scopes.has(t)
        : this.injectorDefTypes.has(t);
    }
    removeOnDestroy(n) {
      let t = this._onDestroyHooks.indexOf(n);
      t !== -1 && this._onDestroyHooks.splice(t, 1);
    }
  };
function Uc(e) {
  let n = mo(e),
    t = n !== null ? n.factory : sn(e);
  if (t !== null) return t;
  if (e instanceof T) throw new b(204, !1);
  if (e instanceof Function) return eE(e);
  throw new b(204, !1);
}
function eE(e) {
  if (e.length > 0) throw new b(204, !1);
  let t = Uy(e);
  return t !== null ? () => t.factory(e) : () => new e();
}
function tE(e) {
  if (vp(e)) return pr(void 0, e.useValue);
  {
    let n = yp(e);
    return pr(n, ss);
  }
}
function yp(e, n, t) {
  let r;
  if (ls(e)) {
    let o = Pe(e);
    return sn(o) || Uc(o);
  } else if (vp(e)) r = () => Pe(e.useValue);
  else if (Xy(e)) r = () => e.useFactory(...Vc(e.deps || []));
  else if (Jy(e)) r = (o, i) => M(Pe(e.useExisting), i !== void 0 && i & 8 ? 8 : void 0);
  else {
    let o = Pe(e && (e.useClass || e.provide));
    if (nE(e)) r = () => new o(...Vc(e.deps));
    else return sn(o) || Uc(o);
  }
  return r;
}
function po(e) {
  if (e.destroyed) throw new b(205, !1);
}
function pr(e, n, t = !1) {
  return { factory: e, value: n, multi: t ? [] : void 0 };
}
function nE(e) {
  return !!e.deps;
}
function rE(e) {
  return e !== null && typeof e == 'object' && typeof e.ngOnDestroy == 'function';
}
function oE(e) {
  return typeof e == 'function' || (typeof e == 'object' && e.ngMetadataName === 'InjectionToken');
}
function $c(e, n) {
  for (let t of e) Array.isArray(t) ? $c(t, n) : t && Qc(t) ? $c(t.ɵproviders, n) : n(t);
}
function Ie(e, n) {
  let t;
  e instanceof xn ? (po(e), (t = e)) : (t = new Bc(e));
  let r,
    o = ut(t),
    i = Se(void 0);
  try {
    return n();
  } finally {
    (ut(o), Se(i));
  }
}
function Ep() {
  return fp() !== void 0 || Mi() != null;
}
var rt = 0,
  x = 1,
  k = 2,
  be = 3,
  Ye = 4,
  Qe = 5,
  vr = 6,
  yr = 7,
  se = 8,
  Er = 9,
  gt = 10,
  ie = 11,
  Dr = 12,
  ul = 13,
  kn = 14,
  Ve = 15,
  Pn = 16,
  Ln = 17,
  Fn = 18,
  Co = 19,
  dl = 20,
  kt = 21,
  ms = 22,
  bo = 23,
  Ue = 24,
  vs = 25,
  we = 26,
  de = 27,
  Dp = 1,
  fl = 6,
  un = 7,
  Io = 8,
  wo = 9,
  ve = 10;
function mt(e) {
  return Array.isArray(e) && typeof e[Dp] == 'object';
}
function ot(e) {
  return Array.isArray(e) && e[Dp] === !0;
}
function pl(e) {
  return (e.flags & 4) !== 0;
}
function dn(e) {
  return e.componentOffset > -1;
}
function ys(e) {
  return (e.flags & 1) === 1;
}
function jn(e) {
  return !!e.template;
}
function Cr(e) {
  return (e[k] & 512) !== 0;
}
function Bn(e) {
  return (e[k] & 256) === 256;
}
var Cp = 'svg',
  bp = 'math';
function Ke(e) {
  for (; Array.isArray(e); ) e = e[rt];
  return e;
}
function hl(e, n) {
  return Ke(n[e]);
}
function vt(e, n) {
  return Ke(n[e.index]);
}
function _o(e, n) {
  return e.data[n];
}
function gl(e, n) {
  return e[n];
}
function ml(e, n, t, r) {
  (t >= e.data.length && ((e.data[t] = null), (e.blueprint[t] = null)), (n[t] = r));
}
function Je(e, n) {
  let t = n[e];
  return mt(t) ? t : t[rt];
}
function Es(e) {
  return (e[k] & 128) === 128;
}
function Ip(e) {
  return ot(e[be]);
}
function yt(e, n) {
  return n == null ? null : e[n];
}
function vl(e) {
  e[Ln] = 0;
}
function yl(e) {
  e[k] & 1024 || ((e[k] |= 1024), Es(e) && So(e));
}
function wp(e, n) {
  for (; e > 0; ) ((n = n[kn]), e--);
  return n;
}
function To(e) {
  return !!(e[k] & 9216 || e[Ue]?.dirty);
}
function Ds(e) {
  (e[gt].changeDetectionScheduler?.notify(8), e[k] & 64 && (e[k] |= 1024), To(e) && So(e));
}
function So(e) {
  e[gt].changeDetectionScheduler?.notify(0);
  let n = an(e);
  for (; n !== null && !(n[k] & 8192 || ((n[k] |= 8192), !Es(n))); ) n = an(n);
}
function El(e, n) {
  if (Bn(e)) throw new b(911, !1);
  (e[kt] === null && (e[kt] = []), e[kt].push(n));
}
function _p(e, n) {
  if (e[kt] === null) return;
  let t = e[kt].indexOf(n);
  t !== -1 && e[kt].splice(t, 1);
}
function an(e) {
  let n = e[be];
  return ot(n) ? n[be] : n;
}
function Tp(e) {
  return (e[yr] ??= []);
}
function Sp(e) {
  return (e.cleanup ??= []);
}
var j = { lFrame: Up(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var Hc = !1;
function Mp() {
  return j.lFrame.elementDepthCount;
}
function Np() {
  j.lFrame.elementDepthCount++;
}
function Dl() {
  j.lFrame.elementDepthCount--;
}
function xp() {
  return j.bindingsEnabled;
}
function Rp() {
  return j.skipHydrationRootTNode !== null;
}
function Cl(e) {
  return j.skipHydrationRootTNode === e;
}
function bl() {
  j.skipHydrationRootTNode = null;
}
function $() {
  return j.lFrame.lView;
}
function $e() {
  return j.lFrame.tView;
}
function Mo(e) {
  return ((j.lFrame.contextLView = e), e[se]);
}
function No(e) {
  return ((j.lFrame.contextLView = null), e);
}
function He() {
  let e = Il();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function Il() {
  return j.lFrame.currentTNode;
}
function Ap() {
  let e = j.lFrame,
    n = e.currentTNode;
  return e.isParent ? n : n.parent;
}
function br(e, n) {
  let t = j.lFrame;
  ((t.currentTNode = e), (t.isParent = n));
}
function wl() {
  return j.lFrame.isParent;
}
function Op() {
  j.lFrame.isParent = !1;
}
function _l() {
  return Hc;
}
function Tl(e) {
  let n = Hc;
  return ((Hc = e), n);
}
function xo() {
  let e = j.lFrame,
    n = e.bindingRootIndex;
  return (n === -1 && (n = e.bindingRootIndex = e.tView.bindingStartIndex), n);
}
function kp(e) {
  return (j.lFrame.bindingIndex = e);
}
function Vn() {
  return j.lFrame.bindingIndex++;
}
function Pp(e) {
  let n = j.lFrame,
    t = n.bindingIndex;
  return ((n.bindingIndex = n.bindingIndex + e), t);
}
function Lp() {
  return j.lFrame.inI18n;
}
function Fp(e, n) {
  let t = j.lFrame;
  ((t.bindingIndex = t.bindingRootIndex = e), Cs(n));
}
function jp() {
  return j.lFrame.currentDirectiveIndex;
}
function Cs(e) {
  j.lFrame.currentDirectiveIndex = e;
}
function Bp(e) {
  let n = j.lFrame.currentDirectiveIndex;
  return n === -1 ? null : e[n];
}
function Sl(e) {
  j.lFrame.currentQueryIndex = e;
}
function iE(e) {
  let n = e[x];
  return n.type === 2 ? n.declTNode : n.type === 1 ? e[Qe] : null;
}
function Ml(e, n, t) {
  if (t & 4) {
    let o = n,
      i = e;
    for (; (o = o.parent), o === null && !(t & 1); )
      if (((o = iE(i)), o === null || ((i = i[kn]), o.type & 10))) break;
    if (o === null) return !1;
    ((n = o), (e = i));
  }
  let r = (j.lFrame = Vp());
  return ((r.currentTNode = n), (r.lView = e), !0);
}
function bs(e) {
  let n = Vp(),
    t = e[x];
  ((j.lFrame = n),
    (n.currentTNode = t.firstChild),
    (n.lView = e),
    (n.tView = t),
    (n.contextLView = e),
    (n.bindingIndex = t.bindingStartIndex),
    (n.inI18n = !1));
}
function Vp() {
  let e = j.lFrame,
    n = e === null ? null : e.child;
  return n === null ? Up(e) : n;
}
function Up(e) {
  let n = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return (e !== null && (e.child = n), n);
}
function $p() {
  let e = j.lFrame;
  return ((j.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e);
}
var Nl = $p;
function Is() {
  let e = $p();
  ((e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0));
}
function Hp(e) {
  return (j.lFrame.contextLView = wp(e, j.lFrame.contextLView))[se];
}
function fn() {
  return j.lFrame.selectedIndex;
}
function pn(e) {
  j.lFrame.selectedIndex = e;
}
function xl() {
  let e = j.lFrame;
  return _o(e.tView, e.selectedIndex);
}
function zp() {
  return j.lFrame.currentNamespace;
}
var Gp = !0;
function ws() {
  return Gp;
}
function _s(e) {
  Gp = e;
}
function zc(e, n = null, t = null, r) {
  let o = Rl(e, n, t, r);
  return (o.resolveInjectorInitializers(), o);
}
function Rl(e, n = null, t = null, r, o = new Set()) {
  let i = [t || qe, yo(e)];
  return ((r = r || (typeof e == 'object' ? void 0 : Pt(e))), new xn(i, n || Do(), r || null, o));
}
var nt = class e {
    static THROW_IF_NOT_FOUND = Mn;
    static NULL = new go();
    static create(n, t) {
      if (Array.isArray(n)) return zc({ name: '' }, t, n, '');
      {
        let r = n.name ?? '';
        return zc({ name: r }, n.parent, n.providers, r);
      }
    }
    static ɵprov = w({ token: e, providedIn: 'any', factory: () => M(ol) });
    static __NG_ELEMENT_ID__ = -1;
  },
  fe = new T(''),
  hn = (() => {
    class e {
      static __NG_ELEMENT_ID__ = sE;
      static __NG_ENV_ID__ = (t) => t;
    }
    return e;
  })(),
  Gc = class extends hn {
    _lView;
    constructor(n) {
      (super(), (this._lView = n));
    }
    get destroyed() {
      return Bn(this._lView);
    }
    onDestroy(n) {
      let t = this._lView;
      return (El(t, n), () => _p(t, n));
    }
  };
function sE() {
  return new Gc($());
}
var pt = class {
    _console = console;
    handleError(n) {
      this._console.error('ERROR', n);
    }
  },
  ze = new T('', {
    providedIn: 'root',
    factory: () => {
      let e = h(me),
        n;
      return (t) => {
        e.destroyed && !n
          ? setTimeout(() => {
              throw t;
            })
          : ((n ??= e.get(pt)), n.handleError(t));
      };
    },
  }),
  Wp = { provide: Lt, useValue: () => void h(pt), multi: !0 };
function Un(e, n) {
  let [t, r, o] = Ec(e, n?.equal),
    i = t,
    s = i[xe];
  return ((i.set = r), (i.update = o), (i.asReadonly = qp.bind(i)), i);
}
function qp() {
  let e = this[xe];
  if (e.readonlyFn === void 0) {
    let n = () => this();
    ((n[xe] = e), (e.readonlyFn = n));
  }
  return e.readonlyFn;
}
var cn = class {},
  Ro = new T('', { providedIn: 'root', factory: () => !1 });
var Al = new T(''),
  Ol = new T('');
var Et = (() => {
    class e {
      taskId = 0;
      pendingTasks = new Set();
      destroyed = !1;
      pendingTask = new pe(!1);
      get hasPendingTasks() {
        return this.destroyed ? !1 : this.pendingTask.value;
      }
      get hasPendingTasksObservable() {
        return this.destroyed
          ? new F((t) => {
              (t.next(!1), t.complete());
            })
          : this.pendingTask;
      }
      add() {
        !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0);
        let t = this.taskId++;
        return (this.pendingTasks.add(t), t);
      }
      has(t) {
        return this.pendingTasks.has(t);
      }
      remove(t) {
        (this.pendingTasks.delete(t),
          this.pendingTasks.size === 0 && this.hasPendingTasks && this.pendingTask.next(!1));
      }
      ngOnDestroy() {
        (this.pendingTasks.clear(),
          this.hasPendingTasks && this.pendingTask.next(!1),
          (this.destroyed = !0),
          this.pendingTask.unsubscribe());
      }
      static ɵprov = w({ token: e, providedIn: 'root', factory: () => new e() });
    }
    return e;
  })(),
  Ao = (() => {
    class e {
      internalPendingTasks = h(Et);
      scheduler = h(cn);
      errorHandler = h(ze);
      add() {
        let t = this.internalPendingTasks.add();
        return () => {
          this.internalPendingTasks.has(t) &&
            (this.scheduler.notify(11), this.internalPendingTasks.remove(t));
        };
      }
      run(t) {
        let r = this.add();
        t().catch(this.errorHandler).finally(r);
      }
      static ɵprov = w({ token: e, providedIn: 'root', factory: () => new e() });
    }
    return e;
  })();
function Oo(...e) {}
var kl = (() => {
    class e {
      static ɵprov = w({ token: e, providedIn: 'root', factory: () => new Wc() });
    }
    return e;
  })(),
  Wc = class {
    dirtyEffectCount = 0;
    queues = new Map();
    add(n) {
      (this.enqueue(n), this.schedule(n));
    }
    schedule(n) {
      n.dirty && this.dirtyEffectCount++;
    }
    remove(n) {
      let t = n.zone,
        r = this.queues.get(t);
      r.has(n) && (r.delete(n), n.dirty && this.dirtyEffectCount--);
    }
    enqueue(n) {
      let t = n.zone;
      this.queues.has(t) || this.queues.set(t, new Set());
      let r = this.queues.get(t);
      r.has(n) || r.add(n);
    }
    flush() {
      for (; this.dirtyEffectCount > 0; ) {
        let n = !1;
        for (let [t, r] of this.queues)
          t === null ? (n ||= this.flushQueue(r)) : (n ||= t.run(() => this.flushQueue(r)));
        n || (this.dirtyEffectCount = 0);
      }
    }
    flushQueue(n) {
      let t = !1;
      for (let r of n) r.dirty && (this.dirtyEffectCount--, (t = !0), r.run());
      return t;
    }
  };
function $o(e) {
  return { toString: e }.toString();
}
function mE(e) {
  return typeof e == 'function';
}
var Ps = class {
  previousValue;
  currentValue;
  firstChange;
  constructor(n, t, r) {
    ((this.previousValue = n), (this.currentValue = t), (this.firstChange = r));
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function Mh(e, n, t, r) {
  n !== null ? n.applyValueToInputSignal(n, r) : (e[t] = r);
}
var gn = (() => {
  let e = () => Nh;
  return ((e.ngInherit = !0), e);
})();
function Nh(e) {
  return (e.type.prototype.ngOnChanges && (e.setInput = yE), vE);
}
function vE() {
  let e = Rh(this),
    n = e?.current;
  if (n) {
    let t = e.previous;
    if (t === An) e.previous = n;
    else for (let r in n) t[r] = n[r];
    ((e.current = null), this.ngOnChanges(n));
  }
}
function yE(e, n, t, r, o) {
  let i = this.declaredInputs[r],
    s = Rh(e) || EE(e, { previous: An, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    l = c[i];
  ((a[i] = new Ps(l && l.currentValue, t, c === An)), Mh(e, n, o, t));
}
var xh = '__ngSimpleChanges__';
function Rh(e) {
  return e[xh] || null;
}
function EE(e, n) {
  return (e[xh] = n);
}
var Zp = [];
var Y = function (e, n = null, t) {
  for (let r = 0; r < Zp.length; r++) {
    let o = Zp[r];
    o(e, n, t);
  }
};
function DE(e, n, t) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = n.type.prototype;
  if (r) {
    let s = Nh(n);
    ((t.preOrderHooks ??= []).push(e, s), (t.preOrderCheckHooks ??= []).push(e, s));
  }
  (o && (t.preOrderHooks ??= []).push(0 - e, o),
    i && ((t.preOrderHooks ??= []).push(e, i), (t.preOrderCheckHooks ??= []).push(e, i)));
}
function CE(e, n) {
  for (let t = n.directiveStart, r = n.directiveEnd; t < r; t++) {
    let i = e.data[t].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: l,
        ngOnDestroy: u,
      } = i;
    (s && (e.contentHooks ??= []).push(-t, s),
      a && ((e.contentHooks ??= []).push(t, a), (e.contentCheckHooks ??= []).push(t, a)),
      c && (e.viewHooks ??= []).push(-t, c),
      l && ((e.viewHooks ??= []).push(t, l), (e.viewCheckHooks ??= []).push(t, l)),
      u != null && (e.destroyHooks ??= []).push(t, u));
  }
}
function Rs(e, n, t) {
  Ah(e, n, 3, t);
}
function As(e, n, t, r) {
  (e[k] & 3) === t && Ah(e, n, t, r);
}
function Pl(e, n) {
  let t = e[k];
  (t & 3) === n && ((t &= 16383), (t += 1), (e[k] = t));
}
function Ah(e, n, t, r) {
  let o = r !== void 0 ? e[Ln] & 65535 : 0,
    i = r ?? -1,
    s = n.length - 1,
    a = 0;
  for (let c = o; c < s; c++)
    if (typeof n[c + 1] == 'number') {
      if (((a = n[c]), r != null && a >= r)) break;
    } else
      (n[c] < 0 && (e[Ln] += 65536),
        (a < i || i == -1) && (bE(e, t, n, c), (e[Ln] = (e[Ln] & 4294901760) + c + 2)),
        c++);
}
function Yp(e, n) {
  Y(4, e, n);
  let t = R(null);
  try {
    n.call(e);
  } finally {
    (R(t), Y(5, e, n));
  }
}
function bE(e, n, t, r) {
  let o = t[r] < 0,
    i = t[r + 1],
    s = o ? -t[r] : t[r],
    a = e[s];
  o ? e[k] >> 14 < e[Ln] >> 16 && (e[k] & 3) === n && ((e[k] += 16384), Yp(a, i)) : Yp(a, i);
}
var wr = -1,
  Lo = class {
    factory;
    name;
    injectImpl;
    resolving = !1;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(n, t, r, o) {
      ((this.factory = n), (this.name = o), (this.canSeeViewProviders = t), (this.injectImpl = r));
    }
  };
function IE(e) {
  return (e.flags & 8) !== 0;
}
function wE(e) {
  return (e.flags & 16) !== 0;
}
function _E(e, n, t) {
  let r = 0;
  for (; r < t.length; ) {
    let o = t[r];
    if (typeof o == 'number') {
      if (o !== 0) break;
      r++;
      let i = t[r++],
        s = t[r++],
        a = t[r++];
      e.setAttribute(n, s, a, i);
    } else {
      let i = o,
        s = t[++r];
      (SE(i) ? e.setProperty(n, i, s) : e.setAttribute(n, i, s), r++);
    }
  }
  return r;
}
function TE(e) {
  return e === 3 || e === 4 || e === 6;
}
function SE(e) {
  return e.charCodeAt(0) === 64;
}
function Js(e, n) {
  if (!(n === null || n.length === 0))
    if (e === null || e.length === 0) e = n.slice();
    else {
      let t = -1;
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        typeof o == 'number'
          ? (t = o)
          : t === 0 || (t === -1 || t === 2 ? Qp(e, t, o, null, n[++r]) : Qp(e, t, o, null, null));
      }
    }
  return e;
}
function Qp(e, n, t, r, o) {
  let i = 0,
    s = e.length;
  if (n === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == 'number') {
        if (a === n) {
          s = -1;
          break;
        } else if (a > n) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == 'number') break;
    if (a === t) {
      o !== null && (e[i + 1] = o);
      return;
    }
    (i++, o !== null && i++);
  }
  (s !== -1 && (e.splice(s, 0, n), (i = s + 1)),
    e.splice(i++, 0, t),
    o !== null && e.splice(i++, 0, o));
}
function Oh(e) {
  return e !== wr;
}
function Ls(e) {
  return e & 32767;
}
function ME(e) {
  return e >> 16;
}
function Fs(e, n) {
  let t = ME(e),
    r = n;
  for (; t > 0; ) ((r = r[kn]), t--);
  return r;
}
var Hl = !0;
function js(e) {
  let n = Hl;
  return ((Hl = e), n);
}
var NE = 256,
  kh = NE - 1,
  Ph = 5,
  xE = 0,
  Dt = {};
function RE(e, n, t) {
  let r;
  (typeof t == 'string' ? (r = t.charCodeAt(0) || 0) : t.hasOwnProperty(Rn) && (r = t[Rn]),
    r == null && (r = t[Rn] = xE++));
  let o = r & kh,
    i = 1 << o;
  n.data[e + (o >> Ph)] |= i;
}
function Lh(e, n) {
  let t = Fh(e, n);
  if (t !== -1) return t;
  let r = n[x];
  r.firstCreatePass &&
    ((e.injectorIndex = n.length), Ll(r.data, e), Ll(n, null), Ll(r.blueprint, null));
  let o = Du(e, n),
    i = e.injectorIndex;
  if (Oh(o)) {
    let s = Ls(o),
      a = Fs(o, n),
      c = a[x].data;
    for (let l = 0; l < 8; l++) n[i + l] = a[s + l] | c[s + l];
  }
  return ((n[i + 8] = o), i);
}
function Ll(e, n) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, n);
}
function Fh(e, n) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    n[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Du(e, n) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let t = 0,
    r = null,
    o = n;
  for (; o !== null; ) {
    if (((r = $h(o)), r === null)) return wr;
    if ((t++, (o = o[kn]), r.injectorIndex !== -1)) return r.injectorIndex | (t << 16);
  }
  return wr;
}
function AE(e, n, t) {
  RE(e, n, t);
}
function jh(e, n, t) {
  if (t & 8 || e !== void 0) return e;
  ps(n, 'NodeInjector');
}
function Bh(e, n, t, r) {
  if ((t & 8 && r === void 0 && (r = null), (t & 3) === 0)) {
    let o = e[Er],
      i = Se(void 0);
    try {
      return o ? o.get(n, r, t & 8) : nl(n, r, t & 8);
    } finally {
      Se(i);
    }
  }
  return jh(r, n, t);
}
function Vh(e, n, t, r = 0, o) {
  if (e !== null) {
    if (n[k] & 2048 && !(r & 2)) {
      let s = FE(e, n, t, r, Dt);
      if (s !== Dt) return s;
    }
    let i = Uh(e, n, t, r, Dt);
    if (i !== Dt) return i;
  }
  return Bh(n, t, r, o);
}
function Uh(e, n, t, r, o) {
  let i = PE(t);
  if (typeof i == 'function') {
    if (!Ml(n, e, r)) return r & 1 ? jh(o, t, r) : Bh(n, t, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & 8))) ps(t);
      else return s;
    } finally {
      Nl();
    }
  } else if (typeof i == 'number') {
    let s = null,
      a = Fh(e, n),
      c = wr,
      l = r & 1 ? n[Ve][Qe] : null;
    for (
      (a === -1 || r & 4) &&
      ((c = a === -1 ? Du(e, n) : n[a + 8]),
      c === wr || !Jp(r, !1) ? (a = -1) : ((s = n[x]), (a = Ls(c)), (n = Fs(c, n))));
      a !== -1;

    ) {
      let u = n[x];
      if (Kp(i, a, u.data)) {
        let d = OE(a, n, t, s, r, l);
        if (d !== Dt) return d;
      }
      ((c = n[a + 8]),
        c !== wr && Jp(r, n[x].data[a + 8] === l) && Kp(i, a, n)
          ? ((s = u), (a = Ls(c)), (n = Fs(c, n)))
          : (a = -1));
    }
  }
  return o;
}
function OE(e, n, t, r, o, i) {
  let s = n[x],
    a = s.data[e + 8],
    c = r == null ? dn(a) && Hl : r != s && (a.type & 3) !== 0,
    l = o & 1 && i === a,
    u = kE(a, s, t, c, l);
  return u !== null ? zl(n, s, u, a, o) : Dt;
}
function kE(e, n, t, r, o) {
  let i = e.providerIndexes,
    s = n.data,
    a = i & 1048575,
    c = e.directiveStart,
    l = e.directiveEnd,
    u = i >> 20,
    d = r ? a : a + u,
    p = o ? a + u : l;
  for (let f = d; f < p; f++) {
    let m = s[f];
    if ((f < c && t === m) || (f >= c && m.type === t)) return f;
  }
  if (o) {
    let f = s[c];
    if (f && jn(f) && f.type === t) return c;
  }
  return null;
}
function zl(e, n, t, r, o) {
  let i = e[t],
    s = n.data;
  if (i instanceof Lo) {
    let a = i;
    if (a.resolving) {
      let f = lp(s[t]);
      throw tl(f);
    }
    let c = js(a.canSeeViewProviders);
    a.resolving = !0;
    let l = s[t].type || s[t],
      u,
      d = a.injectImpl ? Se(a.injectImpl) : null,
      p = Ml(e, r, 0);
    try {
      ((i = e[t] = a.factory(void 0, o, s, e, r)),
        n.firstCreatePass && t >= r.directiveStart && DE(t, s[t], n));
    } finally {
      (d !== null && Se(d), js(c), (a.resolving = !1), Nl());
    }
  }
  return i;
}
function PE(e) {
  if (typeof e == 'string') return e.charCodeAt(0) || 0;
  let n = e.hasOwnProperty(Rn) ? e[Rn] : void 0;
  return typeof n == 'number' ? (n >= 0 ? n & kh : LE) : n;
}
function Kp(e, n, t) {
  let r = 1 << e;
  return !!(t[n + (e >> Ph)] & r);
}
function Jp(e, n) {
  return !(e & 2) && !(e & 1 && n);
}
var $n = class {
  _tNode;
  _lView;
  constructor(n, t) {
    ((this._tNode = n), (this._lView = t));
  }
  get(n, t, r) {
    return Vh(this._tNode, this._lView, n, Nn(r), t);
  }
};
function LE() {
  return new $n(He(), $());
}
function mn(e) {
  return $o(() => {
    let n = e.prototype.constructor,
      t = n[ho] || Gl(n),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[ho] || Gl(o);
      if (i && i !== t) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function Gl(e) {
  return Zc(e)
    ? () => {
        let n = Gl(Pe(e));
        return n && n();
      }
    : sn(e);
}
function FE(e, n, t, r, o) {
  let i = e,
    s = n;
  for (; i !== null && s !== null && s[k] & 2048 && !Cr(s); ) {
    let a = Uh(i, s, t, r | 2, Dt);
    if (a !== Dt) return a;
    let c = i.parent;
    if (!c) {
      let l = s[dl];
      if (l) {
        let u = l.get(t, Dt, r);
        if (u !== Dt) return u;
      }
      ((c = $h(s)), (s = s[kn]));
    }
    i = c;
  }
  return o;
}
function $h(e) {
  let n = e[x],
    t = n.type;
  return t === 2 ? n.declTNode : t === 1 ? e[Qe] : null;
}
function jE() {
  return Cu(He(), $());
}
function Cu(e, n) {
  return new Ho(vt(e, n));
}
var Ho = (() => {
  class e {
    nativeElement;
    constructor(t) {
      this.nativeElement = t;
    }
    static __NG_ELEMENT_ID__ = jE;
  }
  return e;
})();
function Hh(e) {
  return (e.flags & 128) === 128;
}
var bu = (function (e) {
    return ((e[(e.OnPush = 0)] = 'OnPush'), (e[(e.Default = 1)] = 'Default'), e);
  })(bu || {}),
  zh = new Map(),
  BE = 0;
function VE() {
  return BE++;
}
function UE(e) {
  zh.set(e[Co], e);
}
function Wl(e) {
  zh.delete(e[Co]);
}
var Xp = '__ngContext__';
function _r(e, n) {
  mt(n) ? ((e[Xp] = n[Co]), UE(n)) : (e[Xp] = n);
}
function Gh(e) {
  return qh(e[Dr]);
}
function Wh(e) {
  return qh(e[Ye]);
}
function qh(e) {
  for (; e !== null && !ot(e); ) e = e[Ye];
  return e;
}
var ql;
function Iu(e) {
  ql = e;
}
function wu() {
  if (ql !== void 0) return ql;
  if (typeof document < 'u') return document;
  throw new b(210, !1);
}
var Xs = new T('', { providedIn: 'root', factory: () => $E }),
  $E = 'ng',
  ea = new T(''),
  Mr = new T('', { providedIn: 'platform', factory: () => 'unknown' });
var ta = new T('', {
  providedIn: 'root',
  factory: () => wu().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') || null,
});
var HE = 'h',
  zE = 'b';
var Zh = 'r';
var Yh = 'di';
var Qh = !1,
  Kh = new T('', { providedIn: 'root', factory: () => Qh });
var GE = (e, n, t, r) => {};
function WE(e, n, t, r) {
  GE(e, n, t, r);
}
function _u(e) {
  return (e.flags & 32) === 32;
}
var qE = () => null;
function Jh(e, n, t = !1) {
  return qE(e, n, t);
}
function Xh(e, n) {
  let t = e.contentQueries;
  if (t !== null) {
    let r = R(null);
    try {
      for (let o = 0; o < t.length; o += 2) {
        let i = t[o],
          s = t[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          (Sl(i), a.contentQueries(2, n[s], s));
        }
      }
    } finally {
      R(r);
    }
  }
}
function Zl(e, n, t) {
  Sl(0);
  let r = R(null);
  try {
    n(e, t);
  } finally {
    R(r);
  }
}
function eg(e, n, t) {
  if (pl(n)) {
    let r = R(null);
    try {
      let o = n.directiveStart,
        i = n.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let c = t[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      R(r);
    }
  }
}
var Ft = (function (e) {
    return (
      (e[(e.Emulated = 0)] = 'Emulated'),
      (e[(e.None = 2)] = 'None'),
      (e[(e.ShadowDom = 3)] = 'ShadowDom'),
      e
    );
  })(Ft || {}),
  Ts;
function ZE() {
  if (Ts === void 0 && ((Ts = null), Ze.trustedTypes))
    try {
      Ts = Ze.trustedTypes.createPolicy('angular', {
        createHTML: (e) => e,
        createScript: (e) => e,
        createScriptURL: (e) => e,
      });
    } catch {}
  return Ts;
}
function na(e) {
  return ZE()?.createHTML(e) || e;
}
var Ss;
function YE() {
  if (Ss === void 0 && ((Ss = null), Ze.trustedTypes))
    try {
      Ss = Ze.trustedTypes.createPolicy('angular#unsafe-bypass', {
        createHTML: (e) => e,
        createScript: (e) => e,
        createScriptURL: (e) => e,
      });
    } catch {}
  return Ss;
}
function eh(e) {
  return YE()?.createHTML(e) || e;
}
var jt = class {
    changingThisBreaksApplicationSecurity;
    constructor(n) {
      this.changingThisBreaksApplicationSecurity = n;
    }
    toString() {
      return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${us})`;
    }
  },
  Yl = class extends jt {
    getTypeName() {
      return 'HTML';
    }
  },
  Ql = class extends jt {
    getTypeName() {
      return 'Style';
    }
  },
  Kl = class extends jt {
    getTypeName() {
      return 'Script';
    }
  },
  Jl = class extends jt {
    getTypeName() {
      return 'URL';
    }
  },
  Xl = class extends jt {
    getTypeName() {
      return 'ResourceURL';
    }
  };
function bt(e) {
  return e instanceof jt ? e.changingThisBreaksApplicationSecurity : e;
}
function Bt(e, n) {
  let t = tg(e);
  if (t != null && t !== n) {
    if (t === 'ResourceURL' && n === 'URL') return !0;
    throw new Error(`Required a safe ${n}, got a ${t} (see ${us})`);
  }
  return t === n;
}
function tg(e) {
  return (e instanceof jt && e.getTypeName()) || null;
}
function Tu(e) {
  return new Yl(e);
}
function Su(e) {
  return new Ql(e);
}
function Mu(e) {
  return new Kl(e);
}
function Nu(e) {
  return new Jl(e);
}
function xu(e) {
  return new Xl(e);
}
function QE(e) {
  let n = new tu(e);
  return KE() ? new eu(n) : n;
}
var eu = class {
    inertDocumentHelper;
    constructor(n) {
      this.inertDocumentHelper = n;
    }
    getInertBodyElement(n) {
      n = '<body><remove></remove>' + n;
      try {
        let t = new window.DOMParser().parseFromString(na(n), 'text/html').body;
        return t === null
          ? this.inertDocumentHelper.getInertBodyElement(n)
          : (t.firstChild?.remove(), t);
      } catch {
        return null;
      }
    }
  },
  tu = class {
    defaultDoc;
    inertDocument;
    constructor(n) {
      ((this.defaultDoc = n),
        (this.inertDocument =
          this.defaultDoc.implementation.createHTMLDocument('sanitization-inert')));
    }
    getInertBodyElement(n) {
      let t = this.inertDocument.createElement('template');
      return ((t.innerHTML = na(n)), t);
    }
  };
function KE() {
  try {
    return !!new window.DOMParser().parseFromString(na(''), 'text/html');
  } catch {
    return !1;
  }
}
var JE = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function zo(e) {
  return ((e = String(e)), e.match(JE) ? e : 'unsafe:' + e);
}
function Vt(e) {
  let n = {};
  for (let t of e.split(',')) n[t] = !0;
  return n;
}
function Go(...e) {
  let n = {};
  for (let t of e) for (let r in t) t.hasOwnProperty(r) && (n[r] = !0);
  return n;
}
var ng = Vt('area,br,col,hr,img,wbr'),
  rg = Vt('colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr'),
  og = Vt('rp,rt'),
  XE = Go(og, rg),
  eD = Go(
    rg,
    Vt(
      'address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul',
    ),
  ),
  tD = Go(
    og,
    Vt(
      'a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video',
    ),
  ),
  th = Go(ng, eD, tD, XE),
  ig = Vt('background,cite,href,itemtype,longdesc,poster,src,xlink:href'),
  nD = Vt(
    'abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width',
  ),
  rD = Vt(
    'aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext',
  ),
  oD = Go(ig, nD, rD),
  iD = Vt('script,style,template'),
  nu = class {
    sanitizedSomething = !1;
    buf = [];
    sanitizeChildren(n) {
      let t = n.firstChild,
        r = !0,
        o = [];
      for (; t; ) {
        if (
          (t.nodeType === Node.ELEMENT_NODE
            ? (r = this.startElement(t))
            : t.nodeType === Node.TEXT_NODE
              ? this.chars(t.nodeValue)
              : (this.sanitizedSomething = !0),
          r && t.firstChild)
        ) {
          (o.push(t), (t = cD(t)));
          continue;
        }
        for (; t; ) {
          t.nodeType === Node.ELEMENT_NODE && this.endElement(t);
          let i = aD(t);
          if (i) {
            t = i;
            break;
          }
          t = o.pop();
        }
      }
      return this.buf.join('');
    }
    startElement(n) {
      let t = nh(n).toLowerCase();
      if (!th.hasOwnProperty(t)) return ((this.sanitizedSomething = !0), !iD.hasOwnProperty(t));
      (this.buf.push('<'), this.buf.push(t));
      let r = n.attributes;
      for (let o = 0; o < r.length; o++) {
        let i = r.item(o),
          s = i.name,
          a = s.toLowerCase();
        if (!oD.hasOwnProperty(a)) {
          this.sanitizedSomething = !0;
          continue;
        }
        let c = i.value;
        (ig[a] && (c = zo(c)), this.buf.push(' ', s, '="', rh(c), '"'));
      }
      return (this.buf.push('>'), !0);
    }
    endElement(n) {
      let t = nh(n).toLowerCase();
      th.hasOwnProperty(t) &&
        !ng.hasOwnProperty(t) &&
        (this.buf.push('</'), this.buf.push(t), this.buf.push('>'));
    }
    chars(n) {
      this.buf.push(rh(n));
    }
  };
function sD(e, n) {
  return (
    (e.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_CONTAINED_BY) !==
    Node.DOCUMENT_POSITION_CONTAINED_BY
  );
}
function aD(e) {
  let n = e.nextSibling;
  if (n && e !== n.previousSibling) throw sg(n);
  return n;
}
function cD(e) {
  let n = e.firstChild;
  if (n && sD(e, n)) throw sg(n);
  return n;
}
function nh(e) {
  let n = e.nodeName;
  return typeof n == 'string' ? n : 'FORM';
}
function sg(e) {
  return new Error(`Failed to sanitize html because the element is clobbered: ${e.outerHTML}`);
}
var lD = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  uD = /([^\#-~ |!])/g;
function rh(e) {
  return e
    .replace(/&/g, '&amp;')
    .replace(lD, function (n) {
      let t = n.charCodeAt(0),
        r = n.charCodeAt(1);
      return '&#' + ((t - 55296) * 1024 + (r - 56320) + 65536) + ';';
    })
    .replace(uD, function (n) {
      return '&#' + n.charCodeAt(0) + ';';
    })
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
var Ms;
function ra(e, n) {
  let t = null;
  try {
    Ms = Ms || QE(e);
    let r = n ? String(n) : '';
    t = Ms.getInertBodyElement(r);
    let o = 5,
      i = r;
    do {
      if (o === 0) throw new Error('Failed to sanitize html because the input is unstable');
      (o--, (r = i), (i = t.innerHTML), (t = Ms.getInertBodyElement(r)));
    } while (r !== i);
    let a = new nu().sanitizeChildren(oh(t) || t);
    return na(a);
  } finally {
    if (t) {
      let r = oh(t) || t;
      for (; r.firstChild; ) r.firstChild.remove();
    }
  }
}
function oh(e) {
  return 'content' in e && dD(e) ? e.content : null;
}
function dD(e) {
  return e.nodeType === Node.ELEMENT_NODE && e.nodeName === 'TEMPLATE';
}
var at = (function (e) {
  return (
    (e[(e.NONE = 0)] = 'NONE'),
    (e[(e.HTML = 1)] = 'HTML'),
    (e[(e.STYLE = 2)] = 'STYLE'),
    (e[(e.SCRIPT = 3)] = 'SCRIPT'),
    (e[(e.URL = 4)] = 'URL'),
    (e[(e.RESOURCE_URL = 5)] = 'RESOURCE_URL'),
    e
  );
})(at || {});
function oa(e) {
  let n = ag();
  return n ? eh(n.sanitize(at.HTML, e) || '') : Bt(e, 'HTML') ? eh(bt(e)) : ra(wu(), gr(e));
}
function It(e) {
  let n = ag();
  return n ? n.sanitize(at.URL, e) || '' : Bt(e, 'URL') ? bt(e) : zo(gr(e));
}
function ag() {
  let e = $();
  return e && e[gt].sanitizer;
}
function cg(e) {
  return e instanceof Function ? e() : e;
}
function fD(e, n, t) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(n, t);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = n.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    t = o + 1;
  }
}
var lg = 'ng-template';
function pD(e, n, t, r) {
  let o = 0;
  if (r) {
    for (; o < n.length && typeof n[o] == 'string'; o += 2)
      if (n[o] === 'class' && fD(n[o + 1].toLowerCase(), t, 0) !== -1) return !0;
  } else if (Ru(e)) return !1;
  if (((o = n.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < n.length && typeof (i = n[o]) == 'string'; ) if (i.toLowerCase() === t) return !0;
  }
  return !1;
}
function Ru(e) {
  return e.type === 4 && e.value !== lg;
}
function hD(e, n, t) {
  let r = e.type === 4 && !t ? lg : e.value;
  return n === r;
}
function gD(e, n, t) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? yD(o) : 0,
    s = !1;
  for (let a = 0; a < n.length; a++) {
    let c = n[a];
    if (typeof c == 'number') {
      if (!s && !it(r) && !it(c)) return !1;
      if (s && it(c)) continue;
      ((s = !1), (r = c | (r & 1)));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (((r = 2 | (r & 1)), (c !== '' && !hD(e, c, t)) || (c === '' && n.length === 1))) {
          if (it(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !pD(e, o, c, t)) {
          if (it(r)) return !1;
          s = !0;
        }
      } else {
        let l = n[++a],
          u = mD(c, o, Ru(e), t);
        if (u === -1) {
          if (it(r)) return !1;
          s = !0;
          continue;
        }
        if (l !== '') {
          let d;
          if ((u > i ? (d = '') : (d = o[u + 1].toLowerCase()), r & 2 && l !== d)) {
            if (it(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return it(r) || s;
}
function it(e) {
  return (e & 1) === 0;
}
function mD(e, n, t, r) {
  if (n === null) return -1;
  let o = 0;
  if (r || !t) {
    let i = !1;
    for (; o < n.length; ) {
      let s = n[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = n[++o];
        for (; typeof a == 'string'; ) a = n[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return ED(n, e);
}
function vD(e, n, t = !1) {
  for (let r = 0; r < n.length; r++) if (gD(e, n[r], t)) return !0;
  return !1;
}
function yD(e) {
  for (let n = 0; n < e.length; n++) {
    let t = e[n];
    if (TE(t)) return n;
  }
  return e.length;
}
function ED(e, n) {
  let t = e.indexOf(4);
  if (t > -1)
    for (t++; t < e.length; ) {
      let r = e[t];
      if (typeof r == 'number') return -1;
      if (r === n) return t;
      t++;
    }
  return -1;
}
function ih(e, n) {
  return e ? ':not(' + n.trim() + ')' : n;
}
function DD(e) {
  let n = e[0],
    t = 1,
    r = 2,
    o = '',
    i = !1;
  for (; t < e.length; ) {
    let s = e[t];
    if (typeof s == 'string')
      if (r & 2) {
        let a = e[++t];
        o += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']';
      } else r & 8 ? (o += '.' + s) : r & 4 && (o += ' ' + s);
    else (o !== '' && !it(s) && ((n += ih(i, o)), (o = '')), (r = s), (i = i || !it(r)));
    t++;
  }
  return (o !== '' && (n += ih(i, o)), n);
}
function CD(e) {
  return e.map(DD).join(',');
}
function bD(e) {
  let n = [],
    t = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == 'string') o === 2 ? i !== '' && n.push(i, e[++r]) : o === 8 && t.push(i);
    else {
      if (!it(o)) break;
      o = i;
    }
    r++;
  }
  return (t.length && n.push(1, ...t), n);
}
var ct = {};
function ID(e, n) {
  return e.createText(n);
}
function wD(e, n, t) {
  e.setValue(n, t);
}
function ug(e, n, t) {
  return e.createElement(n, t);
}
function Bs(e, n, t, r, o) {
  e.insertBefore(n, t, r, o);
}
function dg(e, n, t) {
  e.appendChild(n, t);
}
function sh(e, n, t, r, o) {
  r !== null ? Bs(e, n, t, r, o) : dg(e, n, t);
}
function fg(e, n, t, r) {
  e.removeChild(null, n, t, r);
}
function _D(e, n, t) {
  e.setAttribute(n, 'style', t);
}
function TD(e, n, t) {
  t === '' ? e.removeAttribute(n, 'class') : e.setAttribute(n, 'class', t);
}
function pg(e, n, t) {
  let { mergedAttrs: r, classes: o, styles: i } = t;
  (r !== null && _E(e, n, r), o !== null && TD(e, n, o), i !== null && _D(e, n, i));
}
function Au(e, n, t, r, o, i, s, a, c, l, u) {
  let d = de + r,
    p = d + o,
    f = SD(d, p),
    m = typeof l == 'function' ? l() : l;
  return (f[x] = {
    type: e,
    blueprint: f,
    template: t,
    queries: null,
    viewQuery: a,
    declTNode: n,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: p,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == 'function' ? i() : i,
    pipeRegistry: typeof s == 'function' ? s() : s,
    firstChild: null,
    schemas: c,
    consts: m,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function SD(e, n) {
  let t = [];
  for (let r = 0; r < n; r++) t.push(r < e ? null : ct);
  return t;
}
function MD(e) {
  let n = e.tView;
  return n === null || n.incompleteFirstPass
    ? (e.tView = Au(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id,
      ))
    : n;
}
function Ou(e, n, t, r, o, i, s, a, c, l, u) {
  let d = n.blueprint.slice();
  return (
    (d[rt] = o),
    (d[k] = r | 4 | 128 | 8 | 64 | 1024),
    (l !== null || (e && e[k] & 2048)) && (d[k] |= 2048),
    vl(d),
    (d[be] = d[kn] = e),
    (d[se] = t),
    (d[gt] = s || (e && e[gt])),
    (d[ie] = a || (e && e[ie])),
    (d[Er] = c || (e && e[Er]) || null),
    (d[Qe] = i),
    (d[Co] = VE()),
    (d[vr] = u),
    (d[dl] = l),
    (d[Ve] = n.type == 2 ? e[Ve] : d),
    d
  );
}
function ND(e, n, t) {
  let r = vt(n, e),
    o = MD(t),
    i = e[gt].rendererFactory,
    s = ku(e, Ou(e, o, null, hg(t), r, n, null, i.createRenderer(r, t), null, null, null));
  return (e[n.index] = s);
}
function hg(e) {
  let n = 16;
  return (e.signals ? (n = 4096) : e.onPush && (n = 64), n);
}
function gg(e, n, t, r) {
  if (t === 0) return -1;
  let o = n.length;
  for (let i = 0; i < t; i++) (n.push(r), e.blueprint.push(r), e.data.push(null));
  return o;
}
function ku(e, n) {
  return (e[Dr] ? (e[ul][Ye] = n) : (e[Dr] = n), (e[ul] = n), n);
}
function g(e = 1) {
  mg($e(), $(), fn() + e, !1);
}
function mg(e, n, t, r) {
  if (!r)
    if ((n[k] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && Rs(n, i, t);
    } else {
      let i = e.preOrderHooks;
      i !== null && As(n, i, 0, t);
    }
  pn(t);
}
var ia = (function (e) {
  return (
    (e[(e.None = 0)] = 'None'),
    (e[(e.SignalBased = 1)] = 'SignalBased'),
    (e[(e.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
    e
  );
})(ia || {});
function ru(e, n, t, r) {
  let o = R(null);
  try {
    let [i, s, a] = e.inputs[t],
      c = null;
    ((s & ia.SignalBased) !== 0 && (c = n[i][xe]),
      c !== null && c.transformFn !== void 0
        ? (r = c.transformFn(r))
        : a !== null && (r = a.call(n, r)),
      e.setInput !== null ? e.setInput(n, c, r, t, i) : Mh(n, c, i, r));
  } finally {
    R(o);
  }
}
var st = (function (e) {
    return ((e[(e.Important = 1)] = 'Important'), (e[(e.DashCase = 2)] = 'DashCase'), e);
  })(st || {}),
  xD;
function Pu(e, n) {
  return xD(e, n);
}
var sa = new Set();
function Ir(e, n, t, r, o, i) {
  if (r != null) {
    let s,
      a = !1;
    ot(r) ? (s = r) : mt(r) && ((a = !0), (r = r[rt]));
    let c = Ke(r);
    (e === 0 && t !== null
      ? o == null
        ? dg(n, t, c)
        : Bs(n, t, c, o || null, !0)
      : e === 1 && t !== null
        ? Bs(n, t, c, o || null, !0)
        : e === 2
          ? ah(i, (l) => {
              fg(n, c, a, l);
            })
          : e === 3 &&
            ah(i, () => {
              n.destroyNode(c);
            }),
      s != null && HD(n, e, s, t, o));
  }
}
function RD(e, n) {
  (vg(e, n), (n[rt] = null), (n[Qe] = null));
}
function AD(e, n, t, r, o, i) {
  ((r[rt] = o), (r[Qe] = n), ca(e, r, t, 1, o, i));
}
function vg(e, n) {
  (n[gt].changeDetectionScheduler?.notify(9), ca(e, n, n[ie], 2, null, null));
}
function OD(e) {
  let n = e[Dr];
  if (!n) return Fl(e[x], e);
  for (; n; ) {
    let t = null;
    if (mt(n)) t = n[Dr];
    else {
      let r = n[ve];
      r && (t = r);
    }
    if (!t) {
      for (; n && !n[Ye] && n !== e; ) (mt(n) && Fl(n[x], n), (n = n[be]));
      (n === null && (n = e), mt(n) && Fl(n[x], n), (t = n && n[Ye]));
    }
    n = t;
  }
}
function Lu(e, n) {
  let t = e[wo],
    r = t.indexOf(n);
  t.splice(r, 1);
}
function aa(e, n) {
  if (Bn(n)) return;
  let t = n[ie];
  (t.destroyNode && ca(e, n, t, 3, null, null), OD(n));
}
function Fl(e, n) {
  if (Bn(n)) return;
  let t = R(null);
  try {
    ((n[k] &= -129),
      (n[k] |= 256),
      n[Ue] && lo(n[Ue]),
      LD(e, n),
      PD(e, n),
      n[x].type === 1 && n[ie].destroy());
    let r = n[Pn];
    if (r !== null && ot(n[be])) {
      r !== n[be] && Lu(r, n);
      let o = n[Fn];
      o !== null && o.detachView(e);
    }
    Wl(n);
  } finally {
    R(t);
  }
}
function ah(e, n) {
  if (e && e[we] && e[we].leave)
    if (e[we].skipLeaveAnimations) e[we].skipLeaveAnimations = !1;
    else {
      let t = e[we].leave,
        r = [];
      for (let o = 0; o < t.length; o++) {
        let i = t[o];
        r.push(i());
      }
      ((e[we].running = Promise.allSettled(r)), (e[we].leave = void 0));
    }
  kD(e, n);
}
function kD(e, n) {
  if (e && e[we] && e[we].running) {
    e[we].running.then(() => {
      (e[we] && e[we].running && (e[we].running = void 0), sa.delete(e), n(!0));
    });
    return;
  }
  n(!1);
}
function PD(e, n) {
  let t = e.cleanup,
    r = n[yr];
  if (t !== null)
    for (let s = 0; s < t.length - 1; s += 2)
      if (typeof t[s] == 'string') {
        let a = t[s + 3];
        (a >= 0 ? r[a]() : r[-a].unsubscribe(), (s += 2));
      } else {
        let a = r[t[s + 1]];
        t[s].call(a);
      }
  r !== null && (n[yr] = null);
  let o = n[kt];
  if (o !== null) {
    n[kt] = null;
    for (let s = 0; s < o.length; s++) {
      let a = o[s];
      a();
    }
  }
  let i = n[bo];
  if (i !== null) {
    n[bo] = null;
    for (let s of i) s.destroy();
  }
}
function LD(e, n) {
  let t;
  if (e != null && (t = e.destroyHooks) != null)
    for (let r = 0; r < t.length; r += 2) {
      let o = n[t[r]];
      if (!(o instanceof Lo)) {
        let i = t[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              c = i[s + 1];
            Y(4, a, c);
            try {
              c.call(a);
            } finally {
              Y(5, a, c);
            }
          }
        else {
          Y(4, o, i);
          try {
            i.call(o);
          } finally {
            Y(5, o, i);
          }
        }
      }
    }
}
function FD(e, n, t) {
  return jD(e, n.parent, t);
}
function jD(e, n, t) {
  let r = n;
  for (; r !== null && r.type & 168; ) ((n = r), (r = n.parent));
  if (r === null) return t[rt];
  if (dn(r)) {
    let { encapsulation: o } = e.data[r.directiveStart + r.componentOffset];
    if (o === Ft.None || o === Ft.Emulated) return null;
  }
  return vt(r, t);
}
function BD(e, n, t) {
  return UD(e, n, t);
}
function VD(e, n, t) {
  return e.type & 40 ? vt(e, t) : null;
}
var UD = VD,
  ch;
function Fu(e, n, t, r) {
  let o = FD(e, r, n),
    i = n[ie],
    s = r.parent || n[Qe],
    a = BD(s, r, n);
  if (o != null)
    if (Array.isArray(t)) for (let c = 0; c < t.length; c++) sh(i, o, t[c], a, !1);
    else sh(i, o, t, a, !1);
  ch !== void 0 && ch(i, r, n, t, o);
}
function ko(e, n) {
  if (n !== null) {
    let t = n.type;
    if (t & 3) return vt(n, e);
    if (t & 4) return ou(-1, e[n.index]);
    if (t & 8) {
      let r = n.child;
      if (r !== null) return ko(e, r);
      {
        let o = e[n.index];
        return ot(o) ? ou(-1, o) : Ke(o);
      }
    } else {
      if (t & 128) return ko(e, n.next);
      if (t & 32) return Pu(n, e)() || Ke(e[n.index]);
      {
        let r = yg(e, n);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = an(e[Ve]);
          return ko(o, r);
        } else return ko(e, n.next);
      }
    }
  }
  return null;
}
function yg(e, n) {
  if (n !== null) {
    let r = e[Ve][Qe],
      o = n.projection;
    return r.projection[o];
  }
  return null;
}
function ou(e, n) {
  let t = ve + e + 1;
  if (t < n.length) {
    let r = n[t],
      o = r[x].firstChild;
    if (o !== null) return ko(r, o);
  }
  return n[un];
}
function ju(e, n, t, r, o, i, s) {
  for (; t != null; ) {
    if (t.type === 128) {
      t = t.next;
      continue;
    }
    let a = r[t.index],
      c = t.type;
    if ((s && n === 0 && (a && _r(Ke(a), r), (t.flags |= 2)), !_u(t)))
      if (c & 8) (ju(e, n, t.child, r, o, i, !1), Ir(n, e, o, a, i, r));
      else if (c & 32) {
        let l = Pu(t, r),
          u;
        for (; (u = l()); ) Ir(n, e, o, u, i, r);
        Ir(n, e, o, a, i, r);
      } else c & 16 ? $D(e, n, r, t, o, i) : Ir(n, e, o, a, i, r);
    t = s ? t.projectionNext : t.next;
  }
}
function ca(e, n, t, r, o, i) {
  ju(t, r, e.firstChild, n, o, i, !1);
}
function $D(e, n, t, r, o, i) {
  let s = t[Ve],
    c = s[Qe].projection[r.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      Ir(n, e, o, u, i, t);
    }
  else {
    let l = c,
      u = s[be];
    (Hh(r) && (l.flags |= 128), ju(e, n, l, u, o, i, !0));
  }
}
function HD(e, n, t, r, o) {
  let i = t[un],
    s = Ke(t);
  i !== s && Ir(n, e, r, i, o);
  for (let a = ve; a < t.length; a++) {
    let c = t[a];
    ca(c[x], c, e, n, r, i);
  }
}
function zD(e, n, t, r, o) {
  if (n) o ? e.addClass(t, r) : e.removeClass(t, r);
  else {
    let i = r.indexOf('-') === -1 ? void 0 : st.DashCase;
    o == null
      ? e.removeStyle(t, r, i)
      : (typeof o == 'string' &&
          o.endsWith('!important') &&
          ((o = o.slice(0, -10)), (i |= st.Important)),
        e.setStyle(t, r, o, i));
  }
}
function Eg(e, n, t, r, o) {
  let i = fn(),
    s = r & 2;
  try {
    (pn(-1), s && n.length > de && mg(e, n, de, !1), Y(s ? 2 : 0, o, t), t(r, o));
  } finally {
    (pn(i), Y(s ? 3 : 1, o, t));
  }
}
function Dg(e, n, t) {
  (KD(e, n, t), (t.flags & 64) === 64 && JD(e, n, t));
}
function Bu(e, n, t = vt) {
  let r = n.localNames;
  if (r !== null) {
    let o = n.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? t(n, e) : e[s];
      e[o++] = a;
    }
  }
}
function GD(e, n, t, r) {
  let i = r.get(Kh, Qh) || t === Ft.ShadowDom,
    s = e.selectRootElement(n, i);
  return (WD(s), s);
}
function WD(e) {
  qD(e);
}
var qD = () => null;
function ZD(e) {
  return e === 'class'
    ? 'className'
    : e === 'for'
      ? 'htmlFor'
      : e === 'formaction'
        ? 'formAction'
        : e === 'innerHtml'
          ? 'innerHTML'
          : e === 'readonly'
            ? 'readOnly'
            : e === 'tabindex'
              ? 'tabIndex'
              : e;
}
function YD(e, n, t, r, o, i) {
  let s = n[x];
  if (Vu(e, s, n, t, r)) {
    dn(e) && QD(n, e.index);
    return;
  }
  (e.type & 3 && (t = ZD(t)), Cg(e, n, t, r, o, i));
}
function Cg(e, n, t, r, o, i) {
  if (e.type & 3) {
    let s = vt(e, n);
    ((r = i != null ? i(r, e.value || '', t) : r), o.setProperty(s, t, r));
  } else e.type & 12;
}
function QD(e, n) {
  let t = Je(n, e);
  t[k] & 16 || (t[k] |= 64);
}
function KD(e, n, t) {
  let r = t.directiveStart,
    o = t.directiveEnd;
  (dn(t) && ND(n, t, e.data[r + t.componentOffset]), e.firstCreatePass || Lh(t, n));
  let i = t.initialInputs;
  for (let s = r; s < o; s++) {
    let a = e.data[s],
      c = zl(n, e, s, t);
    if ((_r(c, n), i !== null && tC(n, s - r, c, a, t, i), jn(a))) {
      let l = Je(t.index, n);
      l[se] = zl(n, e, s, t);
    }
  }
}
function JD(e, n, t) {
  let r = t.directiveStart,
    o = t.directiveEnd,
    i = t.index,
    s = jp();
  try {
    pn(i);
    for (let a = r; a < o; a++) {
      let c = e.data[a],
        l = n[a];
      (Cs(a), (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) && XD(c, l));
    }
  } finally {
    (pn(-1), Cs(s));
  }
}
function XD(e, n) {
  e.hostBindings !== null && e.hostBindings(1, n);
}
function eC(e, n) {
  let t = e.directiveRegistry,
    r = null;
  if (t)
    for (let o = 0; o < t.length; o++) {
      let i = t[o];
      vD(n, i.selectors, !1) && ((r ??= []), jn(i) ? r.unshift(i) : r.push(i));
    }
  return r;
}
function tC(e, n, t, r, o, i) {
  let s = i[n];
  if (s !== null)
    for (let a = 0; a < s.length; a += 2) {
      let c = s[a],
        l = s[a + 1];
      ru(r, t, c, l);
    }
}
function bg(e, n, t, r, o) {
  let i = de + t,
    s = n[x],
    a = o(s, n, e, r, t);
  ((n[i] = a), br(e, !0));
  let c = e.type === 2;
  return (
    c ? (pg(n[ie], a, e), (Mp() === 0 || ys(e)) && _r(a, n), Np()) : _r(a, n),
    ws() && (!c || !_u(e)) && Fu(s, n, a, e),
    e
  );
}
function Ig(e) {
  let n = e;
  return (wl() ? Op() : ((n = n.parent), br(n, !1)), n);
}
function nC(e, n) {
  let t = e[Er];
  if (!t) return;
  let r;
  try {
    r = t.get(ze, null);
  } catch {
    r = null;
  }
  r?.(n);
}
function Vu(e, n, t, r, o) {
  let i = e.inputs?.[r],
    s = e.hostDirectiveInputs?.[r],
    a = !1;
  if (s)
    for (let c = 0; c < s.length; c += 2) {
      let l = s[c],
        u = s[c + 1],
        d = n.data[l];
      (ru(d, t[l], u, o), (a = !0));
    }
  if (i)
    for (let c of i) {
      let l = t[c],
        u = n.data[c];
      (ru(u, l, r, o), (a = !0));
    }
  return a;
}
function rC(e, n) {
  let t = Je(n, e),
    r = t[x];
  oC(r, t);
  let o = t[rt];
  (o !== null && t[vr] === null && (t[vr] = Jh(o, t[Er])), Y(18), Uu(r, t, t[se]), Y(19, t[se]));
}
function oC(e, n) {
  for (let t = n.length; t < e.blueprint.length; t++) n.push(e.blueprint[t]);
}
function Uu(e, n, t) {
  bs(n);
  try {
    let r = e.viewQuery;
    r !== null && Zl(1, r, t);
    let o = e.template;
    (o !== null && Eg(e, n, o, 1, t),
      e.firstCreatePass && (e.firstCreatePass = !1),
      n[Fn]?.finishViewCreation(e),
      e.staticContentQueries && Xh(e, n),
      e.staticViewQueries && Zl(2, e.viewQuery, t));
    let i = e.components;
    i !== null && iC(n, i);
  } catch (r) {
    throw (e.firstCreatePass && ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)), r);
  } finally {
    ((n[k] &= -5), Is());
  }
}
function iC(e, n) {
  for (let t = 0; t < n.length; t++) rC(e, n[t]);
}
function $u(e, n, t, r) {
  let o = R(null);
  try {
    let i = n.tView,
      a = e[k] & 4096 ? 4096 : 16,
      c = Ou(
        e,
        i,
        t,
        a,
        null,
        n,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null,
      ),
      l = e[n.index];
    c[Pn] = l;
    let u = e[Fn];
    return (u !== null && (c[Fn] = u.createEmbeddedView(i)), Uu(i, c, t), c);
  } finally {
    R(o);
  }
}
function Fo(e, n) {
  return !n || n.firstChild === null || Hh(e);
}
function jo(e, n, t, r, o = !1) {
  for (; t !== null; ) {
    if (t.type === 128) {
      t = o ? t.projectionNext : t.next;
      continue;
    }
    let i = n[t.index];
    (i !== null && r.push(Ke(i)), ot(i) && wg(i, r));
    let s = t.type;
    if (s & 8) jo(e, n, t.child, r);
    else if (s & 32) {
      let a = Pu(t, n),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (s & 16) {
      let a = yg(n, t);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = an(n[Ve]);
        jo(c[x], c, a, r, !0);
      }
    }
    t = o ? t.projectionNext : t.next;
  }
  return r;
}
function wg(e, n) {
  for (let t = ve; t < e.length; t++) {
    let r = e[t],
      o = r[x].firstChild;
    o !== null && jo(r[x], r, o, n);
  }
  e[un] !== e[rt] && n.push(e[un]);
}
function _g(e) {
  if (e[vs] !== null) {
    for (let n of e[vs]) n.impl.addSequence(n);
    e[vs].length = 0;
  }
}
var Tg = [];
function sC(e) {
  return e[Ue] ?? aC(e);
}
function aC(e) {
  let n = Tg.pop() ?? Object.create(lC);
  return ((n.lView = e), n);
}
function cC(e) {
  e.lView[Ue] !== e && ((e.lView = null), Tg.push(e));
}
var lC = J(C({}, io), {
  consumerIsAlwaysLive: !0,
  kind: 'template',
  consumerMarkedDirty: (e) => {
    So(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[Ue] = this;
  },
});
function uC(e) {
  let n = e[Ue] ?? Object.create(dC);
  return ((n.lView = e), n);
}
var dC = J(C({}, io), {
  consumerIsAlwaysLive: !0,
  kind: 'template',
  consumerMarkedDirty: (e) => {
    let n = an(e.lView);
    for (; n && !Sg(n[x]); ) n = an(n);
    n && yl(n);
  },
  consumerOnSignalRead() {
    this.lView[Ue] = this;
  },
});
function Sg(e) {
  return e.type !== 2;
}
function Mg(e) {
  if (e[bo] === null) return;
  let n = !0;
  for (; n; ) {
    let t = !1;
    for (let r of e[bo])
      r.dirty &&
        ((t = !0),
        r.zone === null || Zone.current === r.zone ? r.run() : r.zone.run(() => r.run()));
    n = t && !!(e[k] & 8192);
  }
}
var fC = 100;
function Ng(e, n = 0) {
  let r = e[gt].rendererFactory,
    o = !1;
  o || r.begin?.();
  try {
    pC(e, n);
  } finally {
    o || r.end?.();
  }
}
function pC(e, n) {
  let t = _l();
  try {
    (Tl(!0), iu(e, n));
    let r = 0;
    for (; To(e); ) {
      if (r === fC) throw new b(103, !1);
      (r++, iu(e, 1));
    }
  } finally {
    Tl(t);
  }
}
function hC(e, n, t, r) {
  if (Bn(n)) return;
  let o = n[k],
    i = !1,
    s = !1;
  bs(n);
  let a = !0,
    c = null,
    l = null;
  i ||
    (Sg(e)
      ? ((l = sC(n)), (c = ao(l)))
      : Ri() === null
        ? ((a = !1), (l = uC(n)), (c = ao(l)))
        : n[Ue] && (lo(n[Ue]), (n[Ue] = null)));
  try {
    (vl(n), kp(e.bindingStartIndex), t !== null && Eg(e, n, t, 2, r), gC(n));
    let u = (o & 3) === 3;
    if (!i)
      if (u) {
        let f = e.preOrderCheckHooks;
        f !== null && Rs(n, f, null);
      } else {
        let f = e.preOrderHooks;
        (f !== null && As(n, f, 0, null), Pl(n, 0));
      }
    if ((s || mC(n), Mg(n), xg(n, 0), e.contentQueries !== null && Xh(e, n), !i))
      if (u) {
        let f = e.contentCheckHooks;
        f !== null && Rs(n, f);
      } else {
        let f = e.contentHooks;
        (f !== null && As(n, f, 1), Pl(n, 1));
      }
    yC(e, n);
    let d = e.components;
    d !== null && Ag(n, d, 0);
    let p = e.viewQuery;
    if ((p !== null && Zl(2, p, r), !i))
      if (u) {
        let f = e.viewCheckHooks;
        f !== null && Rs(n, f);
      } else {
        let f = e.viewHooks;
        (f !== null && As(n, f, 2), Pl(n, 2));
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), n[ms])) {
      for (let f of n[ms]) f();
      n[ms] = null;
    }
    i || (_g(n), (n[k] &= -73));
  } catch (u) {
    throw (i || So(n), u);
  } finally {
    (l !== null && (Ai(l, c), a && cC(l)), Is());
  }
}
function gC(e) {
  let n = e[we];
  if (n?.enter) {
    for (let t of n.enter) t();
    n.enter = void 0;
  }
}
function xg(e, n) {
  for (let t = Gh(e); t !== null; t = Wh(t))
    for (let r = ve; r < t.length; r++) {
      let o = t[r];
      Rg(o, n);
    }
}
function mC(e) {
  for (let n = Gh(e); n !== null; n = Wh(n)) {
    if (!(n[k] & 2)) continue;
    let t = n[wo];
    for (let r = 0; r < t.length; r++) {
      let o = t[r];
      yl(o);
    }
  }
}
function vC(e, n, t) {
  Y(18);
  let r = Je(n, e);
  (Rg(r, t), Y(19, r[se]));
}
function Rg(e, n) {
  Es(e) && iu(e, n);
}
function iu(e, n) {
  let r = e[x],
    o = e[k],
    i = e[Ue],
    s = !!(n === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && n === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && co(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[k] &= -9217),
    s)
  )
    hC(r, e, r.template, e[se]);
  else if (o & 8192) {
    let a = R(null);
    try {
      (Mg(e), xg(e, 1));
      let c = r.components;
      (c !== null && Ag(e, c, 1), _g(e));
    } finally {
      R(a);
    }
  }
}
function Ag(e, n, t) {
  for (let r = 0; r < n.length; r++) vC(e, n[r], t);
}
function yC(e, n) {
  let t = e.hostBindingOpCodes;
  if (t !== null)
    try {
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        if (o < 0) pn(~o);
        else {
          let i = o,
            s = t[++r],
            a = t[++r];
          Fp(s, i);
          let c = n[i];
          (Y(24, c), a(2, c), Y(25, c));
        }
      }
    } finally {
      pn(-1);
    }
}
function Hu(e, n) {
  let t = _l() ? 64 : 1088;
  for (e[gt].changeDetectionScheduler?.notify(n); e; ) {
    e[k] |= t;
    let r = an(e);
    if (Cr(e) && !r) return e;
    e = r;
  }
  return null;
}
function Og(e, n, t, r) {
  return [e, !0, 0, n, null, r, null, t, null, null];
}
function kg(e, n) {
  let t = ve + n;
  if (t < e.length) return e[t];
}
function la(e, n, t, r = !0) {
  let o = n[x];
  if ((EC(o, n, e, t), r)) {
    let s = ou(t, e),
      a = n[ie],
      c = a.parentNode(e[un]);
    c !== null && AD(o, e[Qe], a, n, c, s);
  }
  let i = n[vr];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function Pg(e, n) {
  let t = Bo(e, n);
  return (t !== void 0 && aa(t[x], t), t);
}
function Bo(e, n) {
  if (e.length <= ve) return;
  let t = ve + n,
    r = e[t];
  if (r) {
    let o = r[Pn];
    (o !== null && o !== e && Lu(o, r), n > 0 && (e[t - 1][Ye] = r[Ye]));
    let i = vo(e, ve + n);
    RD(r[x], r);
    let s = i[Fn];
    (s !== null && s.detachView(i[x]), (r[be] = null), (r[Ye] = null), (r[k] &= -129));
  }
  return r;
}
function EC(e, n, t, r) {
  let o = ve + r,
    i = t.length;
  (r > 0 && (t[o - 1][Ye] = n),
    r < i - ve ? ((n[Ye] = t[o]), rl(t, ve + r, n)) : (t.push(n), (n[Ye] = null)),
    (n[be] = t));
  let s = n[Pn];
  s !== null && t !== s && Lg(s, n);
  let a = n[Fn];
  (a !== null && a.insertView(e), Ds(n), (n[k] |= 128));
}
function Lg(e, n) {
  let t = e[wo],
    r = n[be];
  if (mt(r)) e[k] |= 2;
  else {
    let o = r[be][Ve];
    n[Ve] !== o && (e[k] |= 2);
  }
  t === null ? (e[wo] = [n]) : t.push(n);
}
var Hn = class {
  _lView;
  _cdRefInjectingView;
  _appRef = null;
  _attachedToViewContainer = !1;
  exhaustive;
  get rootNodes() {
    let n = this._lView,
      t = n[x];
    return jo(t, n, t.firstChild, []);
  }
  constructor(n, t) {
    ((this._lView = n), (this._cdRefInjectingView = t));
  }
  get context() {
    return this._lView[se];
  }
  set context(n) {
    this._lView[se] = n;
  }
  get destroyed() {
    return Bn(this._lView);
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let n = this._lView[be];
      if (ot(n)) {
        let t = n[Io],
          r = t ? t.indexOf(this) : -1;
        r > -1 && (Bo(n, r), vo(t, r));
      }
      this._attachedToViewContainer = !1;
    }
    aa(this._lView[x], this._lView);
  }
  onDestroy(n) {
    El(this._lView, n);
  }
  markForCheck() {
    Hu(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[k] &= -129;
  }
  reattach() {
    (Ds(this._lView), (this._lView[k] |= 128));
  }
  detectChanges() {
    ((this._lView[k] |= 1024), Ng(this._lView));
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new b(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let n = Cr(this._lView),
      t = this._lView[Pn];
    (t !== null && !n && Lu(t, this._lView), vg(this._lView[x], this._lView));
  }
  attachToAppRef(n) {
    if (this._attachedToViewContainer) throw new b(902, !1);
    this._appRef = n;
    let t = Cr(this._lView),
      r = this._lView[Pn];
    (r !== null && !t && Lg(r, this._lView), Ds(this._lView));
  }
};
function ua(e, n, t, r, o) {
  let i = e.data[n];
  if (i === null) ((i = DC(e, n, t, r, o)), Lp() && (i.flags |= 32));
  else if (i.type & 64) {
    ((i.type = t), (i.value = r), (i.attrs = o));
    let s = Ap();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return (br(i, !0), i);
}
function DC(e, n, t, r, o) {
  let i = Il(),
    s = wl(),
    a = s ? i : i && i.parent,
    c = (e.data[n] = bC(e, a, t, n, r, o));
  return (CC(e, c, i, s), c);
}
function CC(e, n, t, r) {
  (e.firstChild === null && (e.firstChild = n),
    t !== null &&
      (r
        ? t.child == null && n.parent !== null && (t.child = n)
        : t.next === null && ((t.next = n), (n.prev = t))));
}
function bC(e, n, t, r, o, i) {
  let s = n ? n.injectorIndex : -1,
    a = 0;
  return (
    Rp() && (a |= 128),
    {
      type: t,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: null,
      inputs: null,
      hostDirectiveInputs: null,
      outputs: null,
      hostDirectiveOutputs: null,
      directiveToIndex: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: n,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
var FO = new RegExp(`^(\\d+)*(${zE}|${HE})*(.*)`);
function IC(e) {
  let n = e[fl] ?? [],
    r = e[be][ie],
    o = [];
  for (let i of n) i.data[Yh] !== void 0 ? o.push(i) : wC(i, r);
  e[fl] = o;
}
function wC(e, n) {
  let t = 0,
    r = e.firstChild;
  if (r) {
    let o = e.data[Zh];
    for (; t < o; ) {
      let i = r.nextSibling;
      (fg(n, r, !1), (r = i), t++);
    }
  }
}
var _C = () => null,
  TC = () => null;
function su(e, n) {
  return _C(e, n);
}
function Fg(e, n, t) {
  return TC(e, n, t);
}
var jg = class {},
  da = class {},
  au = class {
    resolveComponentFactory(n) {
      throw new b(917, !1);
    }
  },
  Wo = class {
    static NULL = new au();
  },
  zn = class {},
  zu = (() => {
    class e {
      destroyNode = null;
      static __NG_ELEMENT_ID__ = () => SC();
    }
    return e;
  })();
function SC() {
  let e = $(),
    n = He(),
    t = Je(n.index, e);
  return (mt(t) ? t : e)[ie];
}
var Bg = (() => {
  class e {
    static ɵprov = w({ token: e, providedIn: 'root', factory: () => null });
  }
  return e;
})();
var Os = {},
  cu = class {
    injector;
    parentInjector;
    constructor(n, t) {
      ((this.injector = n), (this.parentInjector = t));
    }
    get(n, t, r) {
      let o = this.injector.get(n, Os, r);
      return o !== Os || t === Os ? o : this.parentInjector.get(n, t, r);
    }
  };
function Vs(e, n, t) {
  let r = t ? e.styles : null,
    o = t ? e.classes : null,
    i = 0;
  if (n !== null)
    for (let s = 0; s < n.length; s++) {
      let a = n[s];
      if (typeof a == 'number') i = a;
      else if (i == 1) o = qc(o, a);
      else if (i == 2) {
        let c = a,
          l = n[++s];
        r = qc(r, c + ': ' + l + ';');
      }
    }
  (t ? (e.styles = r) : (e.stylesWithoutHost = r),
    t ? (e.classes = o) : (e.classesWithoutHost = o));
}
function Ee(e, n = 0) {
  let t = $();
  if (t === null) return M(e, n);
  let r = He();
  return Vh(r, t, Pe(e), n);
}
function MC(e, n, t, r, o) {
  let i = r === null ? null : { '': -1 },
    s = o(e, t);
  if (s !== null) {
    let a = s,
      c = null,
      l = null;
    for (let u of s)
      if (u.resolveHostDirectives !== null) {
        [a, c, l] = u.resolveHostDirectives(s);
        break;
      }
    RC(e, n, t, a, i, c, l);
  }
  i !== null && r !== null && NC(t, r, i);
}
function NC(e, n, t) {
  let r = (e.localNames = []);
  for (let o = 0; o < n.length; o += 2) {
    let i = t[n[o + 1]];
    if (i == null) throw new b(-301, !1);
    r.push(n[o], i);
  }
}
function xC(e, n, t) {
  ((n.componentOffset = t), (e.components ??= []).push(n.index));
}
function RC(e, n, t, r, o, i, s) {
  let a = r.length,
    c = !1;
  for (let p = 0; p < a; p++) {
    let f = r[p];
    (!c && jn(f) && ((c = !0), xC(e, t, p)), AE(Lh(t, n), e, f.type));
  }
  FC(t, e.data.length, a);
  for (let p = 0; p < a; p++) {
    let f = r[p];
    f.providersResolver && f.providersResolver(f);
  }
  let l = !1,
    u = !1,
    d = gg(e, n, a, null);
  a > 0 && (t.directiveToIndex = new Map());
  for (let p = 0; p < a; p++) {
    let f = r[p];
    if (
      ((t.mergedAttrs = Js(t.mergedAttrs, f.hostAttrs)),
      OC(e, t, n, d, f),
      LC(d, f, o),
      s !== null && s.has(f))
    ) {
      let [_, I] = s.get(f);
      t.directiveToIndex.set(f.type, [d, _ + t.directiveStart, I + t.directiveStart]);
    } else (i === null || !i.has(f)) && t.directiveToIndex.set(f.type, d);
    (f.contentQueries !== null && (t.flags |= 4),
      (f.hostBindings !== null || f.hostAttrs !== null || f.hostVars !== 0) && (t.flags |= 64));
    let m = f.type.prototype;
    (!l &&
      (m.ngOnChanges || m.ngOnInit || m.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(t.index), (l = !0)),
      !u &&
        (m.ngOnChanges || m.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(t.index), (u = !0)),
      d++);
  }
  AC(e, t, i);
}
function AC(e, n, t) {
  for (let r = n.directiveStart; r < n.directiveEnd; r++) {
    let o = e.data[r];
    if (t === null || !t.has(o)) (lh(0, n, o, r), lh(1, n, o, r), dh(n, r, !1));
    else {
      let i = t.get(o);
      (uh(0, n, i, r), uh(1, n, i, r), dh(n, r, !0));
    }
  }
}
function lh(e, n, t, r) {
  let o = e === 0 ? t.inputs : t.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s;
      (e === 0 ? (s = n.inputs ??= {}) : (s = n.outputs ??= {}),
        (s[i] ??= []),
        s[i].push(r),
        Vg(n, i));
    }
}
function uh(e, n, t, r) {
  let o = e === 0 ? t.inputs : t.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s = o[i],
        a;
      (e === 0 ? (a = n.hostDirectiveInputs ??= {}) : (a = n.hostDirectiveOutputs ??= {}),
        (a[s] ??= []),
        a[s].push(r, i),
        Vg(n, s));
    }
}
function Vg(e, n) {
  n === 'class' ? (e.flags |= 8) : n === 'style' && (e.flags |= 16);
}
function dh(e, n, t) {
  let { attrs: r, inputs: o, hostDirectiveInputs: i } = e;
  if (r === null || (!t && o === null) || (t && i === null) || Ru(e)) {
    ((e.initialInputs ??= []), e.initialInputs.push(null));
    return;
  }
  let s = null,
    a = 0;
  for (; a < r.length; ) {
    let c = r[a];
    if (c === 0) {
      a += 4;
      continue;
    } else if (c === 5) {
      a += 2;
      continue;
    } else if (typeof c == 'number') break;
    if (!t && o.hasOwnProperty(c)) {
      let l = o[c];
      for (let u of l)
        if (u === n) {
          ((s ??= []), s.push(c, r[a + 1]));
          break;
        }
    } else if (t && i.hasOwnProperty(c)) {
      let l = i[c];
      for (let u = 0; u < l.length; u += 2)
        if (l[u] === n) {
          ((s ??= []), s.push(l[u + 1], r[a + 1]));
          break;
        }
    }
    a += 2;
  }
  ((e.initialInputs ??= []), e.initialInputs.push(s));
}
function OC(e, n, t, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = sn(o.type, !0)),
    s = new Lo(i, jn(o), Ee, null);
  ((e.blueprint[r] = s), (t[r] = s), kC(e, n, r, gg(e, t, o.hostVars, ct), o));
}
function kC(e, n, t, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~n.index;
    (PC(s) != a && s.push(a), s.push(t, r, i));
  }
}
function PC(e) {
  let n = e.length;
  for (; n > 0; ) {
    let t = e[--n];
    if (typeof t == 'number' && t < 0) return t;
  }
  return 0;
}
function LC(e, n, t) {
  if (t) {
    if (n.exportAs) for (let r = 0; r < n.exportAs.length; r++) t[n.exportAs[r]] = e;
    jn(n) && (t[''] = e);
  }
}
function FC(e, n, t) {
  ((e.flags |= 1), (e.directiveStart = n), (e.directiveEnd = n + t), (e.providerIndexes = n));
}
function Ug(e, n, t, r, o, i, s, a) {
  let c = n[x],
    l = c.consts,
    u = yt(l, s),
    d = ua(c, e, t, r, u);
  return (
    i && MC(c, n, d, yt(l, a), o),
    (d.mergedAttrs = Js(d.mergedAttrs, d.attrs)),
    d.attrs !== null && Vs(d, d.attrs, !1),
    d.mergedAttrs !== null && Vs(d, d.mergedAttrs, !0),
    c.queries !== null && c.queries.elementStart(c, d),
    d
  );
}
function $g(e, n) {
  (CE(e, n), pl(n) && e.queries.elementEnd(n));
}
function jC(e, n, t, r, o, i) {
  let s = n.consts,
    a = yt(s, o),
    c = ua(n, e, t, r, a);
  if (((c.mergedAttrs = Js(c.mergedAttrs, c.attrs)), i != null)) {
    let l = yt(s, i);
    c.localNames = [];
    for (let u = 0; u < l.length; u += 2) c.localNames.push(l[u], -1);
  }
  return (
    c.attrs !== null && Vs(c, c.attrs, !1),
    c.mergedAttrs !== null && Vs(c, c.mergedAttrs, !0),
    n.queries !== null && n.queries.elementStart(n, c),
    c
  );
}
function Gu(e) {
  return e !== null && (typeof e == 'function' || typeof e == 'object');
}
function Hg(e, n, t) {
  return (e[n] = t);
}
function Ct(e, n, t) {
  if (t === ct) return !1;
  let r = e[n];
  return Object.is(r, t) ? !1 : ((e[n] = t), !0);
}
function BC(e, n, t, r) {
  let o = Ct(e, n, t);
  return Ct(e, n + 1, r) || o;
}
function ks(e, n, t) {
  return function r(o) {
    let i = dn(e) ? Je(e.index, n) : n;
    Hu(i, 5);
    let s = n[se],
      a = fh(n, s, t, o),
      c = r.__ngNextListenerFn__;
    for (; c; ) ((a = fh(n, s, c, o) && a), (c = c.__ngNextListenerFn__));
    return a;
  };
}
function fh(e, n, t, r) {
  let o = R(null);
  try {
    return (Y(6, n, t), t(r) !== !1);
  } catch (i) {
    return (nC(e, i), !1);
  } finally {
    (Y(7, n, t), R(o));
  }
}
function zg(e, n, t, r, o, i, s, a) {
  let c = ys(e),
    l = !1,
    u = null;
  if ((!r && c && (u = UC(n, t, i, e.index)), u !== null)) {
    let d = u.__ngLastListenerFn__ || u;
    ((d.__ngNextListenerFn__ = s), (u.__ngLastListenerFn__ = s), (l = !0));
  } else {
    let d = vt(e, t),
      p = r ? r(d) : d;
    WE(t, p, i, a);
    let f = o.listen(p, i, a);
    if (!VC(i)) {
      let m = r ? (_) => r(Ke(_[e.index])) : e.index;
      Gg(m, n, t, i, a, f, !1);
    }
  }
  return l;
}
function VC(e) {
  return e.startsWith('animation') || e.startsWith('transition');
}
function UC(e, n, t, r) {
  let o = e.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === t && o[i + 1] === r) {
        let a = n[yr],
          c = o[i + 2];
        return a && a.length > c ? a[c] : null;
      }
      typeof s == 'string' && (i += 2);
    }
  return null;
}
function Gg(e, n, t, r, o, i, s) {
  let a = n.firstCreatePass ? Sp(n) : null,
    c = Tp(t),
    l = c.length;
  (c.push(o, i), a && a.push(r, e, l, (l + 1) * (s ? -1 : 1)));
}
function ph(e, n, t, r, o, i) {
  let s = n[t],
    a = n[x],
    l = a.data[t].outputs[r],
    d = s[l].subscribe(i);
  Gg(e.index, a, n, o, i, d, !0);
}
var lu = Symbol('BINDING');
var Us = class extends Wo {
  ngModule;
  constructor(n) {
    (super(), (this.ngModule = n));
  }
  resolveComponentFactory(n) {
    let t = ln(n);
    return new Tr(t, this.ngModule);
  }
};
function $C(e) {
  return Object.keys(e).map((n) => {
    let [t, r, o] = e[n],
      i = { propName: t, templateName: n, isSignal: (r & ia.SignalBased) !== 0 };
    return (o && (i.transform = o), i);
  });
}
function HC(e) {
  return Object.keys(e).map((n) => ({ propName: e[n], templateName: n }));
}
function zC(e, n, t) {
  let r = n instanceof me ? n : n?.injector;
  return (
    r && e.getStandaloneInjector !== null && (r = e.getStandaloneInjector(r) || r),
    r ? new cu(t, r) : t
  );
}
function GC(e) {
  let n = e.get(zn, null);
  if (n === null) throw new b(407, !1);
  let t = e.get(Bg, null),
    r = e.get(cn, null);
  return { rendererFactory: n, sanitizer: t, changeDetectionScheduler: r, ngReflect: !1 };
}
function WC(e, n) {
  let t = Wg(e);
  return ug(n, t, t === 'svg' ? Cp : t === 'math' ? bp : null);
}
function Wg(e) {
  return (e.selectors[0][0] || 'div').toLowerCase();
}
var Tr = class extends da {
  componentDef;
  ngModule;
  selector;
  componentType;
  ngContentSelectors;
  isBoundToModule;
  cachedInputs = null;
  cachedOutputs = null;
  get inputs() {
    return ((this.cachedInputs ??= $C(this.componentDef.inputs)), this.cachedInputs);
  }
  get outputs() {
    return ((this.cachedOutputs ??= HC(this.componentDef.outputs)), this.cachedOutputs);
  }
  constructor(n, t) {
    (super(),
      (this.componentDef = n),
      (this.ngModule = t),
      (this.componentType = n.type),
      (this.selector = CD(n.selectors)),
      (this.ngContentSelectors = n.ngContentSelectors ?? []),
      (this.isBoundToModule = !!t));
  }
  create(n, t, r, o, i, s) {
    Y(22);
    let a = R(null);
    try {
      let c = this.componentDef,
        l = qC(r, c, s, i),
        u = zC(c, o || this.ngModule, n),
        d = GC(u),
        p = d.rendererFactory.createRenderer(null, c),
        f = r ? GD(p, r, c.encapsulation, u) : WC(c, p),
        m = s?.some(hh) || i?.some((D) => typeof D != 'function' && D.bindings.some(hh)),
        _ = Ou(null, l, null, 512 | hg(c), null, null, d, p, u, null, Jh(f, u, !0));
      ((_[de] = f), bs(_));
      let I = null;
      try {
        let D = Ug(de, _, 2, '#host', () => l.directiveRegistry, !0, 0);
        (pg(p, f, D),
          _r(f, _),
          Dg(l, _, D),
          eg(l, D, _),
          $g(l, D),
          t !== void 0 && YC(D, this.ngContentSelectors, t),
          (I = Je(D.index, _)),
          (_[se] = I[se]),
          Uu(l, _, null));
      } catch (D) {
        throw (I !== null && Wl(I), Wl(_), D);
      } finally {
        (Y(23), Is());
      }
      return new $s(this.componentType, _, !!m);
    } finally {
      R(a);
    }
  }
};
function qC(e, n, t, r) {
  let o = e ? ['ng-version', '20.3.3'] : bD(n.selectors[0]),
    i = null,
    s = null,
    a = 0;
  if (t)
    for (let u of t)
      ((a += u[lu].requiredVars),
        u.create && ((u.targetIdx = 0), (i ??= []).push(u)),
        u.update && ((u.targetIdx = 0), (s ??= []).push(u)));
  if (r)
    for (let u = 0; u < r.length; u++) {
      let d = r[u];
      if (typeof d != 'function')
        for (let p of d.bindings) {
          a += p[lu].requiredVars;
          let f = u + 1;
          (p.create && ((p.targetIdx = f), (i ??= []).push(p)),
            p.update && ((p.targetIdx = f), (s ??= []).push(p)));
        }
    }
  let c = [n];
  if (r)
    for (let u of r) {
      let d = typeof u == 'function' ? u : u.type,
        p = al(d);
      c.push(p);
    }
  return Au(0, null, ZC(i, s), 1, a, c, null, null, null, [o], null);
}
function ZC(e, n) {
  return !e && !n
    ? null
    : (t) => {
        if (t & 1 && e) for (let r of e) r.create();
        if (t & 2 && n) for (let r of n) r.update();
      };
}
function hh(e) {
  let n = e[lu].kind;
  return n === 'input' || n === 'twoWay';
}
var $s = class extends jg {
  _rootLView;
  _hasInputBindings;
  instance;
  hostView;
  changeDetectorRef;
  componentType;
  location;
  previousInputValues = null;
  _tNode;
  constructor(n, t, r) {
    (super(),
      (this._rootLView = t),
      (this._hasInputBindings = r),
      (this._tNode = _o(t[x], de)),
      (this.location = Cu(this._tNode, t)),
      (this.instance = Je(this._tNode.index, t)[se]),
      (this.hostView = this.changeDetectorRef = new Hn(t, void 0)),
      (this.componentType = n));
  }
  setInput(n, t) {
    this._hasInputBindings;
    let r = this._tNode;
    if (
      ((this.previousInputValues ??= new Map()),
      this.previousInputValues.has(n) && Object.is(this.previousInputValues.get(n), t))
    )
      return;
    let o = this._rootLView,
      i = Vu(r, o[x], o, n, t);
    this.previousInputValues.set(n, t);
    let s = Je(r.index, o);
    Hu(s, 1);
  }
  get injector() {
    return new $n(this._tNode, this._rootLView);
  }
  destroy() {
    this.hostView.destroy();
  }
  onDestroy(n) {
    this.hostView.onDestroy(n);
  }
};
function YC(e, n, t) {
  let r = (e.projection = []);
  for (let o = 0; o < n.length; o++) {
    let i = t[o];
    r.push(i != null && i.length ? Array.from(i) : null);
  }
}
var qo = (() => {
  class e {
    static __NG_ELEMENT_ID__ = QC;
  }
  return e;
})();
function QC() {
  let e = He();
  return JC(e, $());
}
var KC = qo,
  qg = class extends KC {
    _lContainer;
    _hostTNode;
    _hostLView;
    constructor(n, t, r) {
      (super(), (this._lContainer = n), (this._hostTNode = t), (this._hostLView = r));
    }
    get element() {
      return Cu(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new $n(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let n = Du(this._hostTNode, this._hostLView);
      if (Oh(n)) {
        let t = Fs(n, this._hostLView),
          r = Ls(n),
          o = t[x].data[r + 8];
        return new $n(o, t);
      } else return new $n(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(n) {
      let t = gh(this._lContainer);
      return (t !== null && t[n]) || null;
    }
    get length() {
      return this._lContainer.length - ve;
    }
    createEmbeddedView(n, t, r) {
      let o, i;
      typeof r == 'number' ? (o = r) : r != null && ((o = r.index), (i = r.injector));
      let s = su(this._lContainer, n.ssrId),
        a = n.createEmbeddedViewImpl(t || {}, i, s);
      return (this.insertImpl(a, o, Fo(this._hostTNode, s)), a);
    }
    createComponent(n, t, r, o, i, s, a) {
      let c = n && !mE(n),
        l;
      if (c) l = t;
      else {
        let I = t || {};
        ((l = I.index),
          (r = I.injector),
          (o = I.projectableNodes),
          (i = I.environmentInjector || I.ngModuleRef),
          (s = I.directives),
          (a = I.bindings));
      }
      let u = c ? n : new Tr(ln(n)),
        d = r || this.parentInjector;
      if (!i && u.ngModule == null) {
        let D = (c ? d : this.parentInjector).get(me, null);
        D && (i = D);
      }
      let p = ln(u.componentType ?? {}),
        f = su(this._lContainer, p?.id ?? null),
        m = f?.firstChild ?? null,
        _ = u.create(d, o, m, i, s, a);
      return (this.insertImpl(_.hostView, l, Fo(this._hostTNode, f)), _);
    }
    insert(n, t) {
      return this.insertImpl(n, t, !0);
    }
    insertImpl(n, t, r) {
      let o = n._lView;
      if (Ip(o)) {
        let a = this.indexOf(n);
        if (a !== -1) this.detach(a);
        else {
          let c = o[be],
            l = new qg(c, c[Qe], c[be]);
          l.detach(l.indexOf(n));
        }
      }
      let i = this._adjustIndex(t),
        s = this._lContainer;
      return (la(s, o, i, r), n.attachToViewContainerRef(), rl(jl(s), i, n), n);
    }
    move(n, t) {
      return this.insert(n, t);
    }
    indexOf(n) {
      let t = gh(this._lContainer);
      return t !== null ? t.indexOf(n) : -1;
    }
    remove(n) {
      let t = this._adjustIndex(n, -1),
        r = Bo(this._lContainer, t);
      r && (vo(jl(this._lContainer), t), aa(r[x], r));
    }
    detach(n) {
      let t = this._adjustIndex(n, -1),
        r = Bo(this._lContainer, t);
      return r && vo(jl(this._lContainer), t) != null ? new Hn(r) : null;
    }
    _adjustIndex(n, t = 0) {
      return n ?? this.length + t;
    }
  };
function gh(e) {
  return e[Io];
}
function jl(e) {
  return e[Io] || (e[Io] = []);
}
function JC(e, n) {
  let t,
    r = n[e.index];
  return (
    ot(r) ? (t = r) : ((t = Og(r, n, null, e)), (n[e.index] = t), ku(n, t)),
    eb(t, n, e, r),
    new qg(t, e, n)
  );
}
function XC(e, n) {
  let t = e[ie],
    r = t.createComment(''),
    o = vt(n, e),
    i = t.parentNode(o);
  return (Bs(t, i, r, t.nextSibling(o), !1), r);
}
var eb = rb,
  tb = () => !1;
function nb(e, n, t) {
  return tb(e, n, t);
}
function rb(e, n, t, r) {
  if (e[un]) return;
  let o;
  (t.type & 8 ? (o = Ke(r)) : (o = XC(n, t)), (e[un] = o));
}
var mh = new Set();
function qn(e) {
  mh.has(e) || (mh.add(e), performance?.mark?.('mark_feature_usage', { detail: { feature: e } }));
}
var Gn = class {},
  fa = class {};
var Hs = class extends Gn {
    ngModuleType;
    _parent;
    _bootstrapComponents = [];
    _r3Injector;
    instance;
    destroyCbs = [];
    componentFactoryResolver = new Us(this);
    constructor(n, t, r, o = !0) {
      (super(), (this.ngModuleType = n), (this._parent = t));
      let i = sl(n);
      ((this._bootstrapComponents = cg(i.bootstrap)),
        (this._r3Injector = Rl(
          n,
          t,
          [
            { provide: Gn, useValue: this },
            { provide: Wo, useValue: this.componentFactoryResolver },
            ...r,
          ],
          Pt(n),
          new Set(['environment']),
        )),
        o && this.resolveInjectorInitializers());
    }
    resolveInjectorInitializers() {
      (this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(this.ngModuleType)));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let n = this._r3Injector;
      (!n.destroyed && n.destroy(), this.destroyCbs.forEach((t) => t()), (this.destroyCbs = null));
    }
    onDestroy(n) {
      this.destroyCbs.push(n);
    }
  },
  zs = class extends fa {
    moduleType;
    constructor(n) {
      (super(), (this.moduleType = n));
    }
    create(n) {
      return new Hs(this.moduleType, n, []);
    }
  };
var Vo = class extends Gn {
  injector;
  componentFactoryResolver = new Us(this);
  instance = null;
  constructor(n) {
    super();
    let t = new xn(
      [
        ...n.providers,
        { provide: Gn, useValue: this },
        { provide: Wo, useValue: this.componentFactoryResolver },
      ],
      n.parent || Do(),
      n.debugName,
      new Set(['environment']),
    );
    ((this.injector = t), n.runEnvironmentInitializers && t.resolveInjectorInitializers());
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(n) {
    this.injector.onDestroy(n);
  }
};
function Zo(e, n, t = null) {
  return new Vo({ providers: e, parent: n, debugName: t, runEnvironmentInitializers: !0 }).injector;
}
var ob = (() => {
  class e {
    _injector;
    cachedInjectors = new Map();
    constructor(t) {
      this._injector = t;
    }
    getOrCreateStandaloneInjector(t) {
      if (!t.standalone) return null;
      if (!this.cachedInjectors.has(t)) {
        let r = cl(!1, t.type),
          o = r.length > 0 ? Zo([r], this._injector, `Standalone[${t.type.name}]`) : null;
        this.cachedInjectors.set(t, o);
      }
      return this.cachedInjectors.get(t);
    }
    ngOnDestroy() {
      try {
        for (let t of this.cachedInjectors.values()) t !== null && t.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static ɵprov = w({ token: e, providedIn: 'environment', factory: () => new e(M(me)) });
  }
  return e;
})();
function Me(e) {
  return $o(() => {
    let n = Zg(e),
      t = J(C({}, n), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === bu.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (n.standalone && e.dependencies) || null,
        getStandaloneInjector: n.standalone
          ? (o) => o.get(ob).getOrCreateStandaloneInjector(t)
          : null,
        getExternalStyles: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || Ft.Emulated,
        styles: e.styles || qe,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: '',
      });
    (n.standalone && qn('NgStandalone'), Yg(t));
    let r = e.dependencies;
    return ((t.directiveDefs = vh(r, ib)), (t.pipeDefs = vh(r, gp)), (t.id = cb(t)), t);
  });
}
function ib(e) {
  return ln(e) || al(e);
}
function Ut(e) {
  return $o(() => ({
    type: e.type,
    bootstrap: e.bootstrap || qe,
    declarations: e.declarations || qe,
    imports: e.imports || qe,
    exports: e.exports || qe,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function sb(e, n) {
  if (e == null) return An;
  let t = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a,
        c;
      (Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i), (c = o[3] || null))
        : ((i = o), (s = o), (a = ia.None), (c = null)),
        (t[i] = [r, a, c]),
        (n[i] = s));
    }
  return t;
}
function ab(e) {
  if (e == null) return An;
  let n = {};
  for (let t in e) e.hasOwnProperty(t) && (n[e[t]] = t);
  return n;
}
function Nr(e) {
  return $o(() => {
    let n = Zg(e);
    return (Yg(n), n);
  });
}
function xr(e) {
  return {
    type: e.type,
    name: e.name,
    factory: null,
    pure: e.pure !== !1,
    standalone: e.standalone ?? !0,
    onDestroy: e.type.prototype.ngOnDestroy || null,
  };
}
function Zg(e) {
  let n = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: n,
    inputConfig: e.inputs || An,
    exportAs: e.exportAs || null,
    standalone: e.standalone ?? !0,
    signals: e.signals === !0,
    selectors: e.selectors || qe,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    resolveHostDirectives: null,
    hostDirectives: null,
    inputs: sb(e.inputs, n),
    outputs: ab(e.outputs),
    debugInfo: null,
  };
}
function Yg(e) {
  e.features?.forEach((n) => n(e));
}
function vh(e, n) {
  return e
    ? () => {
        let t = typeof e == 'function' ? e() : e,
          r = [];
        for (let o of t) {
          let i = n(o);
          i !== null && r.push(i);
        }
        return r;
      }
    : null;
}
function cb(e) {
  let n = 0,
    t = typeof e.consts == 'function' ? '' : e.consts,
    r = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      t,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ];
  for (let i of r.join('|')) n = (Math.imul(31, n) + i.charCodeAt(0)) << 0;
  return ((n += 2147483648), 'c' + n);
}
function lb(e, n, t, r, o, i, s, a) {
  if (t.firstCreatePass) {
    e.mergedAttrs = Js(e.mergedAttrs, e.attrs);
    let u = (e.tView = Au(
      2,
      e,
      o,
      i,
      s,
      t.directiveRegistry,
      t.pipeRegistry,
      null,
      t.schemas,
      t.consts,
      null,
    ));
    t.queries !== null && (t.queries.template(t, e), (u.queries = t.queries.embeddedTView(e)));
  }
  (a && (e.flags |= a), br(e, !1));
  let c = ub(t, n, e, r);
  (ws() && Fu(t, n, c, e), _r(c, n));
  let l = Og(c, n, c, e);
  ((n[r + de] = l), ku(n, l), nb(l, e, n));
}
function Gs(e, n, t, r, o, i, s, a, c, l, u) {
  let d = t + de,
    p;
  if (n.firstCreatePass) {
    if (((p = ua(n, d, 4, s || null, a || null)), l != null)) {
      let f = yt(n.consts, l);
      p.localNames = [];
      for (let m = 0; m < f.length; m += 2) p.localNames.push(f[m], -1);
    }
  } else p = n.data[d];
  return (lb(p, e, n, t, r, o, i, c), l != null && Bu(e, p, u), p);
}
var ub = db;
function db(e, n, t, r) {
  return (_s(!0), n[ie].createComment(''));
}
var Wu = (function (e) {
    return (
      (e[(e.CHANGE_DETECTION = 0)] = 'CHANGE_DETECTION'),
      (e[(e.AFTER_NEXT_RENDER = 1)] = 'AFTER_NEXT_RENDER'),
      e
    );
  })(Wu || {}),
  Yo = new T(''),
  Qg = !1,
  uu = class extends X {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(n = !1) {
      (super(),
        (this.__isAsync = n),
        Ep() &&
          ((this.destroyRef = h(hn, { optional: !0 }) ?? void 0),
          (this.pendingTasks = h(Et, { optional: !0 }) ?? void 0)));
    }
    emit(n) {
      let t = R(null);
      try {
        super.next(n);
      } finally {
        R(t);
      }
    }
    subscribe(n, t, r) {
      let o = n,
        i = t || (() => null),
        s = r;
      if (n && typeof n == 'object') {
        let c = n;
        ((o = c.next?.bind(c)), (i = c.error?.bind(c)), (s = c.complete?.bind(c)));
      }
      this.__isAsync &&
        ((i = this.wrapInTimeout(i)),
        o && (o = this.wrapInTimeout(o)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: o, error: i, complete: s });
      return (n instanceof le && n.add(a), a);
    }
    wrapInTimeout(n) {
      return (t) => {
        let r = this.pendingTasks?.add();
        setTimeout(() => {
          try {
            n(t);
          } finally {
            r !== void 0 && this.pendingTasks?.remove(r);
          }
        });
      };
    }
  },
  ye = uu;
function Kg(e) {
  let n, t;
  function r() {
    e = Oo;
    try {
      (t !== void 0 && typeof cancelAnimationFrame == 'function' && cancelAnimationFrame(t),
        n !== void 0 && clearTimeout(n));
    } catch {}
  }
  return (
    (n = setTimeout(() => {
      (e(), r());
    })),
    typeof requestAnimationFrame == 'function' &&
      (t = requestAnimationFrame(() => {
        (e(), r());
      })),
    () => r()
  );
}
function yh(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = Oo;
    }
  );
}
var qu = 'isAngularZone',
  Ws = qu + '_ID',
  fb = 0,
  ae = class e {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new ye(!1);
    onMicrotaskEmpty = new ye(!1);
    onStable = new ye(!1);
    onError = new ye(!1);
    constructor(n) {
      let {
        enableLongStackTrace: t = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: o = !1,
        scheduleInRootZone: i = Qg,
      } = n;
      if (typeof Zone > 'u') throw new b(908, !1);
      Zone.assertZonePatched();
      let s = this;
      ((s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        t && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !o && r),
        (s.shouldCoalesceRunChangeDetection = o),
        (s.callbackScheduled = !1),
        (s.scheduleInRootZone = i),
        gb(s));
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get(qu) === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new b(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new b(909, !1);
    }
    run(n, t, r) {
      return this._inner.run(n, t, r);
    }
    runTask(n, t, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask('NgZoneEvent: ' + o, n, pb, Oo, Oo);
      try {
        return i.runTask(s, t, r);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(n, t, r) {
      return this._inner.runGuarded(n, t, r);
    }
    runOutsideAngular(n) {
      return this._outer.run(n);
    }
  },
  pb = {};
function Zu(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      (e._nesting++, e.onMicrotaskEmpty.emit(null));
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function hb(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function n() {
    Kg(() => {
      ((e.callbackScheduled = !1),
        du(e),
        (e.isCheckStableRunning = !0),
        Zu(e),
        (e.isCheckStableRunning = !1));
    });
  }
  (e.scheduleInRootZone
    ? Zone.root.run(() => {
        n();
      })
    : e._outer.run(() => {
        n();
      }),
    du(e));
}
function gb(e) {
  let n = () => {
      hb(e);
    },
    t = fb++;
  e._inner = e._inner.fork({
    name: 'angular',
    properties: { [qu]: !0, [Ws]: t, [Ws + t]: !0 },
    onInvokeTask: (r, o, i, s, a, c) => {
      if (mb(c)) return r.invokeTask(i, s, a, c);
      try {
        return (Eh(e), r.invokeTask(i, s, a, c));
      } finally {
        (((e.shouldCoalesceEventChangeDetection && s.type === 'eventTask') ||
          e.shouldCoalesceRunChangeDetection) &&
          n(),
          Dh(e));
      }
    },
    onInvoke: (r, o, i, s, a, c, l) => {
      try {
        return (Eh(e), r.invoke(i, s, a, c, l));
      } finally {
        (e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !vb(c) && n(), Dh(e));
      }
    },
    onHasTask: (r, o, i, s) => {
      (r.hasTask(i, s),
        o === i &&
          (s.change == 'microTask'
            ? ((e._hasPendingMicrotasks = s.microTask), du(e), Zu(e))
            : s.change == 'macroTask' && (e.hasPendingMacrotasks = s.macroTask)));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s),
      e.runOutsideAngular(() => e.onError.emit(s)),
      !1
    ),
  });
}
function du(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function Eh(e) {
  (e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null)));
}
function Dh(e) {
  (e._nesting--, Zu(e));
}
var qs = class {
  hasPendingMicrotasks = !1;
  hasPendingMacrotasks = !1;
  isStable = !0;
  onUnstable = new ye();
  onMicrotaskEmpty = new ye();
  onStable = new ye();
  onError = new ye();
  run(n, t, r) {
    return n.apply(t, r);
  }
  runGuarded(n, t, r) {
    return n.apply(t, r);
  }
  runOutsideAngular(n) {
    return n();
  }
  runTask(n, t, r, o) {
    return n.apply(t, r);
  }
};
function mb(e) {
  return Jg(e, '__ignore_ng_zone__');
}
function vb(e) {
  return Jg(e, '__scheduler_tick__');
}
function Jg(e, n) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[n] === !0;
}
var Xg = (() => {
  class e {
    impl = null;
    execute() {
      this.impl?.execute();
    }
    static ɵprov = w({ token: e, providedIn: 'root', factory: () => new e() });
  }
  return e;
})();
var pa = (() => {
  class e {
    log(t) {
      console.log(t);
    }
    warn(t) {
      console.warn(t);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'platform' });
  }
  return e;
})();
var Yu = new T('');
function Rr(e) {
  return !!e && typeof e.then == 'function';
}
function Qu(e) {
  return !!e && typeof e.subscribe == 'function';
}
var em = new T('');
var Ku = (() => {
    class e {
      resolve;
      reject;
      initialized = !1;
      done = !1;
      donePromise = new Promise((t, r) => {
        ((this.resolve = t), (this.reject = r));
      });
      appInits = h(em, { optional: !0 }) ?? [];
      injector = h(nt);
      constructor() {}
      runInitializers() {
        if (this.initialized) return;
        let t = [];
        for (let o of this.appInits) {
          let i = Ie(this.injector, o);
          if (Rr(i)) t.push(i);
          else if (Qu(i)) {
            let s = new Promise((a, c) => {
              i.subscribe({ complete: a, error: c });
            });
            t.push(s);
          }
        }
        let r = () => {
          ((this.done = !0), this.resolve());
        };
        (Promise.all(t)
          .then(() => {
            r();
          })
          .catch((o) => {
            this.reject(o);
          }),
          t.length === 0 && r(),
          (this.initialized = !0));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  ha = new T('');
function tm() {
  yc(() => {
    let e = '';
    throw new b(600, e);
  });
}
function nm(e) {
  return e.isBoundToModule;
}
var yb = 10;
var vn = (() => {
  class e {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = h(ze);
    afterRenderManager = h(Xg);
    zonelessEnabled = h(Ro);
    rootEffectScheduler = h(kl);
    dirtyFlags = 0;
    tracingSnapshot = null;
    allTestViews = new Set();
    autoDetectTestViews = new Set();
    includeAllTestViews = !1;
    afterTick = new X();
    get allViews() {
      return [
        ...(this.includeAllTestViews ? this.allTestViews : this.autoDetectTestViews).keys(),
        ...this._views,
      ];
    }
    get destroyed() {
      return this._destroyed;
    }
    componentTypes = [];
    components = [];
    internalPendingTask = h(Et);
    get isStable() {
      return this.internalPendingTask.hasPendingTasksObservable.pipe(A((t) => !t));
    }
    constructor() {
      h(Yo, { optional: !0 });
    }
    whenStable() {
      let t;
      return new Promise((r) => {
        t = this.isStable.subscribe({
          next: (o) => {
            o && r();
          },
        });
      }).finally(() => {
        t.unsubscribe();
      });
    }
    _injector = h(me);
    _rendererFactory = null;
    get injector() {
      return this._injector;
    }
    bootstrap(t, r) {
      return this.bootstrapImpl(t, r);
    }
    bootstrapImpl(t, r, o = nt.NULL) {
      return this._injector.get(ae).run(() => {
        Y(10);
        let s = t instanceof da;
        if (!this._injector.get(Ku).done) {
          let m = '';
          throw new b(405, m);
        }
        let c;
        (s ? (c = t) : (c = this._injector.get(Wo).resolveComponentFactory(t)),
          this.componentTypes.push(c.componentType));
        let l = nm(c) ? void 0 : this._injector.get(Gn),
          u = r || c.selector,
          d = c.create(o, [], u, l),
          p = d.location.nativeElement,
          f = d.injector.get(Yu, null);
        return (
          f?.registerApplication(p),
          d.onDestroy(() => {
            (this.detachView(d.hostView), Po(this.components, d), f?.unregisterApplication(p));
          }),
          this._loadComponent(d),
          Y(11, d),
          d
        );
      });
    }
    tick() {
      (this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick());
    }
    _tick() {
      (Y(12),
        this.tracingSnapshot !== null
          ? this.tracingSnapshot.run(Wu.CHANGE_DETECTION, this.tickImpl)
          : this.tickImpl());
    }
    tickImpl = () => {
      if (this._runningTick) throw new b(101, !1);
      let t = R(null);
      try {
        ((this._runningTick = !0), this.synchronize());
      } finally {
        ((this._runningTick = !1),
          this.tracingSnapshot?.dispose(),
          (this.tracingSnapshot = null),
          R(t),
          this.afterTick.next(),
          Y(13));
      }
    };
    synchronize() {
      this._rendererFactory === null &&
        !this._injector.destroyed &&
        (this._rendererFactory = this._injector.get(zn, null, { optional: !0 }));
      let t = 0;
      for (; this.dirtyFlags !== 0 && t++ < yb; ) (Y(14), this.synchronizeOnce(), Y(15));
    }
    synchronizeOnce() {
      this.dirtyFlags & 16 && ((this.dirtyFlags &= -17), this.rootEffectScheduler.flush());
      let t = !1;
      if (this.dirtyFlags & 7) {
        let r = !!(this.dirtyFlags & 1);
        ((this.dirtyFlags &= -8), (this.dirtyFlags |= 8));
        for (let { _lView: o } of this.allViews) {
          if (!r && !To(o)) continue;
          let i = r && !this.zonelessEnabled ? 0 : 1;
          (Ng(o, i), (t = !0));
        }
        if (((this.dirtyFlags &= -5), this.syncDirtyFlagsWithViews(), this.dirtyFlags & 23)) return;
      }
      (t || (this._rendererFactory?.begin?.(), this._rendererFactory?.end?.()),
        this.dirtyFlags & 8 && ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews());
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: t }) => To(t))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(t) {
      let r = t;
      (this._views.push(r), r.attachToAppRef(this));
    }
    detachView(t) {
      let r = t;
      (Po(this._views, r), r.detachFromAppRef());
    }
    _loadComponent(t) {
      this.attachView(t.hostView);
      try {
        this.tick();
      } catch (o) {
        this.internalErrorHandler(o);
      }
      (this.components.push(t), this._injector.get(ha, []).forEach((o) => o(t)));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          (this._destroyListeners.forEach((t) => t()),
            this._views.slice().forEach((t) => t.destroy()));
        } finally {
          ((this._destroyed = !0), (this._views = []), (this._destroyListeners = []));
        }
    }
    onDestroy(t) {
      return (this._destroyListeners.push(t), () => Po(this._destroyListeners, t));
    }
    destroy() {
      if (this._destroyed) throw new b(406, !1);
      let t = this._injector;
      t.destroy && !t.destroyed && t.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
function Po(e, n) {
  let t = e.indexOf(n);
  t > -1 && e.splice(t, 1);
}
var zO = typeof document < 'u' && typeof document?.documentElement?.getAnimations == 'function';
var fu = class {
  destroy(n) {}
  updateValue(n, t) {}
  swap(n, t) {
    let r = Math.min(n, t),
      o = Math.max(n, t),
      i = this.detach(o);
    if (o - r > 1) {
      let s = this.detach(r);
      (this.attach(r, i), this.attach(o, s));
    } else this.attach(r, i);
  }
  move(n, t) {
    this.attach(t, this.detach(n, !0));
  }
};
function Bl(e, n, t, r, o) {
  return e === t && Object.is(n, r) ? 1 : Object.is(o(e, n), o(t, r)) ? -1 : 0;
}
function Eb(e, n, t) {
  let r,
    o,
    i = 0,
    s = e.length - 1,
    a = void 0;
  if (Array.isArray(n)) {
    let c = n.length - 1;
    for (; i <= s && i <= c; ) {
      let l = e.at(i),
        u = n[i],
        d = Bl(i, l, i, u, t);
      if (d !== 0) {
        (d < 0 && e.updateValue(i, u), i++);
        continue;
      }
      let p = e.at(s),
        f = n[c],
        m = Bl(s, p, c, f, t);
      if (m !== 0) {
        (m < 0 && e.updateValue(s, f), s--, c--);
        continue;
      }
      let _ = t(i, l),
        I = t(s, p),
        D = t(i, u);
      if (Object.is(D, I)) {
        let z = t(c, f);
        (Object.is(z, _) ? (e.swap(i, s), e.updateValue(s, f), c--, s--) : e.move(s, i),
          e.updateValue(i, u),
          i++);
        continue;
      }
      if (((r ??= new Zs()), (o ??= bh(e, i, s, t)), pu(e, r, i, D)))
        (e.updateValue(i, u), i++, s++);
      else if (o.has(D)) (r.set(_, e.detach(i)), s--);
      else {
        let z = e.create(i, n[i]);
        (e.attach(i, z), i++, s++);
      }
    }
    for (; i <= c; ) (Ch(e, r, t, i, n[i]), i++);
  } else if (n != null) {
    let c = n[Symbol.iterator](),
      l = c.next();
    for (; !l.done && i <= s; ) {
      let u = e.at(i),
        d = l.value,
        p = Bl(i, u, i, d, t);
      if (p !== 0) (p < 0 && e.updateValue(i, d), i++, (l = c.next()));
      else {
        ((r ??= new Zs()), (o ??= bh(e, i, s, t)));
        let f = t(i, d);
        if (pu(e, r, i, f)) (e.updateValue(i, d), i++, s++, (l = c.next()));
        else if (!o.has(f)) (e.attach(i, e.create(i, d)), i++, s++, (l = c.next()));
        else {
          let m = t(i, u);
          (r.set(m, e.detach(i)), s--);
        }
      }
    }
    for (; !l.done; ) (Ch(e, r, t, e.length, l.value), (l = c.next()));
  }
  for (; i <= s; ) e.destroy(e.detach(s--));
  r?.forEach((c) => {
    e.destroy(c);
  });
}
function pu(e, n, t, r) {
  return n !== void 0 && n.has(r) ? (e.attach(t, n.get(r)), n.delete(r), !0) : !1;
}
function Ch(e, n, t, r, o) {
  if (pu(e, n, r, t(r, o))) e.updateValue(r, o);
  else {
    let i = e.create(r, o);
    e.attach(r, i);
  }
}
function bh(e, n, t, r) {
  let o = new Set();
  for (let i = n; i <= t; i++) o.add(r(i, e.at(i)));
  return o;
}
var Zs = class {
  kvMap = new Map();
  _vMap = void 0;
  has(n) {
    return this.kvMap.has(n);
  }
  delete(n) {
    if (!this.has(n)) return !1;
    let t = this.kvMap.get(n);
    return (
      this._vMap !== void 0 && this._vMap.has(t)
        ? (this.kvMap.set(n, this._vMap.get(t)), this._vMap.delete(t))
        : this.kvMap.delete(n),
      !0
    );
  }
  get(n) {
    return this.kvMap.get(n);
  }
  set(n, t) {
    if (this.kvMap.has(n)) {
      let r = this.kvMap.get(n);
      this._vMap === void 0 && (this._vMap = new Map());
      let o = this._vMap;
      for (; o.has(r); ) r = o.get(r);
      o.set(r, t);
    } else this.kvMap.set(n, t);
  }
  forEach(n) {
    for (let [t, r] of this.kvMap)
      if ((n(r, t), this._vMap !== void 0)) {
        let o = this._vMap;
        for (; o.has(r); ) ((r = o.get(r)), n(r, t));
      }
  }
};
function ne(e, n, t, r, o, i, s, a) {
  qn('NgControlFlow');
  let c = $(),
    l = $e(),
    u = yt(l.consts, i);
  return (Gs(c, l, e, n, t, r, o, u, 256, s, a), Ju);
}
function Ju(e, n, t, r, o, i, s, a) {
  qn('NgControlFlow');
  let c = $(),
    l = $e(),
    u = yt(l.consts, i);
  return (Gs(c, l, e, n, t, r, o, u, 512, s, a), Ju);
}
function re(e, n) {
  qn('NgControlFlow');
  let t = $(),
    r = Vn(),
    o = t[r] !== ct ? t[r] : -1,
    i = o !== -1 ? Ys(t, de + o) : void 0,
    s = 0;
  if (Ct(t, r, e)) {
    let a = R(null);
    try {
      if ((i !== void 0 && Pg(i, s), e !== -1)) {
        let c = de + e,
          l = Ys(t, c),
          u = vu(t[x], c),
          d = Fg(l, u, t),
          p = $u(t, u, n, { dehydratedView: d });
        la(l, p, s, Fo(u, d));
      }
    } finally {
      R(a);
    }
  } else if (i !== void 0) {
    let a = kg(i, s);
    a !== void 0 && (a[se] = n);
  }
}
var hu = class {
  lContainer;
  $implicit;
  $index;
  constructor(n, t, r) {
    ((this.lContainer = n), (this.$implicit = t), (this.$index = r));
  }
  get $count() {
    return this.lContainer.length - ve;
  }
};
function Zn(e, n) {
  return n;
}
var gu = class {
  hasEmptyBlock;
  trackByFn;
  liveCollection;
  constructor(n, t, r) {
    ((this.hasEmptyBlock = n), (this.trackByFn = t), (this.liveCollection = r));
  }
};
function $t(e, n, t, r, o, i, s, a, c, l, u, d, p) {
  qn('NgControlFlow');
  let f = $(),
    m = $e(),
    _ = c !== void 0,
    I = $(),
    D = a ? s.bind(I[Ve][se]) : s,
    z = new gu(_, D);
  ((I[de + e] = z),
    Gs(f, m, e + 1, n, t, r, o, yt(m.consts, i), 256),
    _ && Gs(f, m, e + 2, c, l, u, d, yt(m.consts, p), 512));
}
var mu = class extends fu {
  lContainer;
  hostLView;
  templateTNode;
  operationsCounter = void 0;
  needsIndexUpdate = !1;
  constructor(n, t, r) {
    (super(), (this.lContainer = n), (this.hostLView = t), (this.templateTNode = r));
  }
  get length() {
    return this.lContainer.length - ve;
  }
  at(n) {
    return this.getLView(n)[se].$implicit;
  }
  attach(n, t) {
    let r = t[vr];
    ((this.needsIndexUpdate ||= n !== this.length),
      la(this.lContainer, t, n, Fo(this.templateTNode, r)));
  }
  detach(n, t) {
    return (
      (this.needsIndexUpdate ||= n !== this.length - 1),
      t && Db(this.lContainer, n),
      Cb(this.lContainer, n)
    );
  }
  create(n, t) {
    let r = su(this.lContainer, this.templateTNode.tView.ssrId),
      o = $u(this.hostLView, this.templateTNode, new hu(this.lContainer, t, n), {
        dehydratedView: r,
      });
    return (this.operationsCounter?.recordCreate(), o);
  }
  destroy(n) {
    (aa(n[x], n), this.operationsCounter?.recordDestroy());
  }
  updateValue(n, t) {
    this.getLView(n)[se].$implicit = t;
  }
  reset() {
    ((this.needsIndexUpdate = !1), this.operationsCounter?.reset());
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let n = 0; n < this.length; n++) this.getLView(n)[se].$index = n;
  }
  getLView(n) {
    return bb(this.lContainer, n);
  }
};
function Ht(e) {
  let n = R(null),
    t = fn();
  try {
    let r = $(),
      o = r[x],
      i = r[t],
      s = t + 1,
      a = Ys(r, s);
    if (i.liveCollection === void 0) {
      let l = vu(o, s);
      i.liveCollection = new mu(a, r, l);
    } else i.liveCollection.reset();
    let c = i.liveCollection;
    if ((Eb(c, e, i.trackByFn), c.updateIndexes(), i.hasEmptyBlock)) {
      let l = Vn(),
        u = c.length === 0;
      if (Ct(r, l, u)) {
        let d = t + 2,
          p = Ys(r, d);
        if (u) {
          let f = vu(o, d),
            m = Fg(p, f, r),
            _ = $u(r, f, void 0, { dehydratedView: m });
          la(p, _, 0, Fo(f, m));
        } else (o.firstUpdatePass && IC(p), Pg(p, 0));
      }
    }
  } finally {
    R(n);
  }
}
function Ys(e, n) {
  return e[n];
}
function Db(e, n) {
  if (e.length <= ve) return;
  let t = ve + n,
    r = e[t];
  r && r[we] && (r[we].skipLeaveAnimations = !0);
}
function Cb(e, n) {
  return Bo(e, n);
}
function bb(e, n) {
  return kg(e, n);
}
function vu(e, n) {
  return _o(e, n);
}
function Q(e, n, t) {
  let r = $(),
    o = Vn();
  if (Ct(r, o, n)) {
    let i = $e(),
      s = xl();
    YD(s, r, e, n, r[ie], t);
  }
  return Q;
}
function Ih(e, n, t, r, o) {
  Vu(n, e, t, o ? 'class' : 'style', r);
}
function B(e, n, t, r) {
  let o = $(),
    i = o[x],
    s = e + de,
    a = i.firstCreatePass ? Ug(s, o, 2, n, eC, xp(), t, r) : i.data[s];
  if ((bg(a, o, e, n, rm), ys(a))) {
    let c = o[x];
    (Dg(c, o, a), eg(c, a, o));
  }
  return (r != null && Bu(o, a), B);
}
function N() {
  let e = $e(),
    n = He(),
    t = Ig(n);
  return (
    e.firstCreatePass && $g(e, t),
    Cl(t) && bl(),
    Dl(),
    t.classesWithoutHost != null && IE(t) && Ih(e, t, $(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null && wE(t) && Ih(e, t, $(), t.stylesWithoutHost, !1),
    N
  );
}
function ce(e, n, t, r) {
  return (B(e, n, t, r), N(), ce);
}
function E(e, n, t, r) {
  let o = $(),
    i = o[x],
    s = e + de,
    a = i.firstCreatePass ? jC(s, i, 2, n, t, r) : i.data[s];
  return (bg(a, o, e, n, rm), r != null && Bu(o, a), E);
}
function v() {
  let e = He(),
    n = Ig(e);
  return (Cl(n) && bl(), Dl(), v);
}
function ga(e, n, t, r) {
  return (E(e, n, t, r), v(), ga);
}
var rm = (e, n, t, r, o) => (_s(!0), ug(n[ie], r, zp()));
function ma() {
  return $();
}
function zt(e, n, t) {
  let r = $(),
    o = Vn();
  if (Ct(r, o, n)) {
    let i = $e(),
      s = xl();
    Cg(s, r, e, n, r[ie], t);
  }
  return zt;
}
var Ns = void 0;
function Ib(e) {
  let n = Math.floor(Math.abs(e)),
    t = e.toString().replace(/^[^.]*\.?/, '').length;
  return n === 1 && t === 0 ? 1 : 5;
}
var wb = [
    'en',
    [
      ['a', 'p'],
      ['AM', 'PM'],
    ],
    [['AM', 'PM']],
    [
      ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    ],
    Ns,
    [
      ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    ],
    Ns,
    [
      ['B', 'A'],
      ['BC', 'AD'],
      ['Before Christ', 'Anno Domini'],
    ],
    0,
    [6, 0],
    ['M/d/yy', 'MMM d, y', 'MMMM d, y', 'EEEE, MMMM d, y'],
    ['h:mm a', 'h:mm:ss a', 'h:mm:ss a z', 'h:mm:ss a zzzz'],
    ['{1}, {0}', Ns, "{1} 'at' {0}", Ns],
    ['.', ',', ';', '%', '+', '-', 'E', '\xD7', '\u2030', '\u221E', 'NaN', ':'],
    ['#,##0.###', '#,##0%', '\xA4#,##0.00', '#E0'],
    'USD',
    '$',
    'US Dollar',
    {},
    'ltr',
    Ib,
  ],
  Vl = {};
function va(e) {
  let n = _b(e),
    t = wh(n);
  if (t) return t;
  let r = n.split('-')[0];
  if (((t = wh(r)), t)) return t;
  if (r === 'en') return wb;
  throw new b(701, !1);
}
function wh(e) {
  return (
    e in Vl || (Vl[e] = Ze.ng && Ze.ng.common && Ze.ng.common.locales && Ze.ng.common.locales[e]),
    Vl[e]
  );
}
var Yn = (function (e) {
  return (
    (e[(e.LocaleId = 0)] = 'LocaleId'),
    (e[(e.DayPeriodsFormat = 1)] = 'DayPeriodsFormat'),
    (e[(e.DayPeriodsStandalone = 2)] = 'DayPeriodsStandalone'),
    (e[(e.DaysFormat = 3)] = 'DaysFormat'),
    (e[(e.DaysStandalone = 4)] = 'DaysStandalone'),
    (e[(e.MonthsFormat = 5)] = 'MonthsFormat'),
    (e[(e.MonthsStandalone = 6)] = 'MonthsStandalone'),
    (e[(e.Eras = 7)] = 'Eras'),
    (e[(e.FirstDayOfWeek = 8)] = 'FirstDayOfWeek'),
    (e[(e.WeekendRange = 9)] = 'WeekendRange'),
    (e[(e.DateFormat = 10)] = 'DateFormat'),
    (e[(e.TimeFormat = 11)] = 'TimeFormat'),
    (e[(e.DateTimeFormat = 12)] = 'DateTimeFormat'),
    (e[(e.NumberSymbols = 13)] = 'NumberSymbols'),
    (e[(e.NumberFormats = 14)] = 'NumberFormats'),
    (e[(e.CurrencyCode = 15)] = 'CurrencyCode'),
    (e[(e.CurrencySymbol = 16)] = 'CurrencySymbol'),
    (e[(e.CurrencyName = 17)] = 'CurrencyName'),
    (e[(e.Currencies = 18)] = 'Currencies'),
    (e[(e.Directionality = 19)] = 'Directionality'),
    (e[(e.PluralCase = 20)] = 'PluralCase'),
    (e[(e.ExtraData = 21)] = 'ExtraData'),
    e
  );
})(Yn || {});
function _b(e) {
  return e.toLowerCase().replace(/_/g, '-');
}
var Qo = 'en-US';
var Tb = Qo;
function om(e) {
  typeof e == 'string' && (Tb = e.toLowerCase().replace(/_/g, '-'));
}
function wt(e, n, t) {
  let r = $(),
    o = $e(),
    i = He();
  return (Sb(o, r, r[ie], i, e, n, t), wt);
}
function P(e, n, t) {
  let r = $(),
    o = $e(),
    i = He();
  return ((i.type & 3 || t) && zg(i, o, r, t, r[ie], e, n, ks(i, r, n)), P);
}
function Sb(e, n, t, r, o, i, s) {
  let a = !0,
    c = null;
  if (((r.type & 3 || s) && ((c ??= ks(r, n, i)), zg(r, e, n, s, t, o, i, c) && (a = !1)), a)) {
    let l = r.outputs?.[o],
      u = r.hostDirectiveOutputs?.[o];
    if (u && u.length)
      for (let d = 0; d < u.length; d += 2) {
        let p = u[d],
          f = u[d + 1];
        ((c ??= ks(r, n, i)), ph(r, n, p, f, o, c));
      }
    if (l && l.length) for (let d of l) ((c ??= ks(r, n, i)), ph(r, n, d, o, o, c));
  }
}
function K(e = 1) {
  return Hp(e);
}
function xs(e, n) {
  return (e << 17) | (n << 2);
}
function Wn(e) {
  return (e >> 17) & 32767;
}
function Mb(e) {
  return (e & 2) == 2;
}
function Nb(e, n) {
  return (e & 131071) | (n << 17);
}
function yu(e) {
  return e | 2;
}
function Sr(e) {
  return (e & 131068) >> 2;
}
function Ul(e, n) {
  return (e & -131069) | (n << 2);
}
function xb(e) {
  return (e & 1) === 1;
}
function Eu(e) {
  return e | 1;
}
function Rb(e, n, t, r, o, i) {
  let s = i ? n.classBindings : n.styleBindings,
    a = Wn(s),
    c = Sr(s);
  e[r] = t;
  let l = !1,
    u;
  if (Array.isArray(t)) {
    let d = t;
    ((u = d[1]), (u === null || mr(d, u) > 0) && (l = !0));
  } else u = t;
  if (o)
    if (c !== 0) {
      let p = Wn(e[a + 1]);
      ((e[r + 1] = xs(p, a)),
        p !== 0 && (e[p + 1] = Ul(e[p + 1], r)),
        (e[a + 1] = Nb(e[a + 1], r)));
    } else ((e[r + 1] = xs(a, 0)), a !== 0 && (e[a + 1] = Ul(e[a + 1], r)), (a = r));
  else ((e[r + 1] = xs(c, 0)), a === 0 ? (a = r) : (e[c + 1] = Ul(e[c + 1], r)), (c = r));
  (l && (e[r + 1] = yu(e[r + 1])),
    _h(e, u, r, !0),
    _h(e, u, r, !1),
    Ab(n, u, e, r, i),
    (s = xs(a, c)),
    i ? (n.classBindings = s) : (n.styleBindings = s));
}
function Ab(e, n, t, r, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null && typeof n == 'string' && mr(i, n) >= 0 && (t[r + 1] = Eu(t[r + 1]));
}
function _h(e, n, t, r) {
  let o = e[t + 1],
    i = n === null,
    s = r ? Wn(o) : Sr(o),
    a = !1;
  for (; s !== 0 && (a === !1 || i); ) {
    let c = e[s],
      l = e[s + 1];
    (Ob(c, n) && ((a = !0), (e[s + 1] = r ? Eu(l) : yu(l))), (s = r ? Wn(l) : Sr(l)));
  }
  a && (e[t + 1] = r ? yu(o) : Eu(o));
}
function Ob(e, n) {
  return e === null || n == null || (Array.isArray(e) ? e[1] : e) === n
    ? !0
    : Array.isArray(e) && typeof n == 'string'
      ? mr(e, n) >= 0
      : !1;
}
function oe(e, n) {
  return (kb(e, n, null, !0), oe);
}
function kb(e, n, t, r) {
  let o = $(),
    i = $e(),
    s = Pp(2);
  if ((i.firstUpdatePass && Lb(i, e, s, r), n !== ct && Ct(o, s, n))) {
    let a = i.data[fn()];
    Ub(i, a, o, o[ie], e, (o[s + 1] = $b(n, t)), r, s);
  }
}
function Pb(e, n) {
  return n >= e.expandoStartIndex;
}
function Lb(e, n, t, r) {
  let o = e.data;
  if (o[t + 1] === null) {
    let i = o[fn()],
      s = Pb(e, t);
    (Hb(i, r) && n === null && !s && (n = !1), (n = Fb(o, i, n, r)), Rb(o, i, n, t, s, r));
  }
}
function Fb(e, n, t, r) {
  let o = Bp(e),
    i = r ? n.residualClasses : n.residualStyles;
  if (o === null)
    (r ? n.classBindings : n.styleBindings) === 0 &&
      ((t = $l(null, e, n, t, r)), (t = Uo(t, n.attrs, r)), (i = null));
  else {
    let s = n.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((t = $l(o, e, n, t, r)), i === null)) {
        let c = jb(e, n, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = $l(null, e, n, c[1], r)), (c = Uo(c, n.attrs, r)), Bb(e, n, r, c));
      } else i = Vb(e, n, r);
  }
  return (i !== void 0 && (r ? (n.residualClasses = i) : (n.residualStyles = i)), t);
}
function jb(e, n, t) {
  let r = t ? n.classBindings : n.styleBindings;
  if (Sr(r) !== 0) return e[Wn(r)];
}
function Bb(e, n, t, r) {
  let o = t ? n.classBindings : n.styleBindings;
  e[Wn(o)] = r;
}
function Vb(e, n, t) {
  let r,
    o = n.directiveEnd;
  for (let i = 1 + n.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    r = Uo(r, s, t);
  }
  return Uo(r, n.attrs, t);
}
function $l(e, n, t, r, o) {
  let i = null,
    s = t.directiveEnd,
    a = t.directiveStylingLast;
  for (
    a === -1 ? (a = t.directiveStart) : a++;
    a < s && ((i = n[a]), (r = Uo(r, i.hostAttrs, o)), i !== e);

  )
    a++;
  return (e !== null && (t.directiveStylingLast = a), r);
}
function Uo(e, n, t) {
  let r = t ? 1 : 2,
    o = -1;
  if (n !== null)
    for (let i = 0; i < n.length; i++) {
      let s = n[i];
      typeof s == 'number'
        ? (o = s)
        : o === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ['', e]), hp(e, s, t ? !0 : n[++i]));
    }
  return e === void 0 ? null : e;
}
function Ub(e, n, t, r, o, i, s, a) {
  if (!(n.type & 3)) return;
  let c = e.data,
    l = c[a + 1],
    u = xb(l) ? Th(c, n, t, o, Sr(l), s) : void 0;
  if (!Qs(u)) {
    Qs(i) || (Mb(l) && (i = Th(c, null, t, o, a, s)));
    let d = hl(fn(), t);
    zD(r, s, d, o, i);
  }
}
function Th(e, n, t, r, o, i) {
  let s = n === null,
    a;
  for (; o > 0; ) {
    let c = e[o],
      l = Array.isArray(c),
      u = l ? c[1] : c,
      d = u === null,
      p = t[o + 1];
    p === ct && (p = d ? qe : void 0);
    let f = d ? gs(p, r) : u === r ? p : void 0;
    if ((l && !Qs(f) && (f = gs(c, r)), Qs(f) && ((a = f), s))) return a;
    let m = e[o + 1];
    o = s ? Wn(m) : Sr(m);
  }
  if (n !== null) {
    let c = i ? n.residualClasses : n.residualStyles;
    c != null && (a = gs(c, r));
  }
  return a;
}
function Qs(e) {
  return e !== void 0;
}
function $b(e, n) {
  return (
    e == null ||
      e === '' ||
      (typeof n == 'string' ? (e = e + n) : typeof e == 'object' && (e = Pt(bt(e)))),
    e
  );
}
function Hb(e, n) {
  return (e.flags & (n ? 8 : 16)) !== 0;
}
function y(e, n = '') {
  let t = $(),
    r = $e(),
    o = e + de,
    i = r.firstCreatePass ? ua(r, o, 1, n, null) : r.data[o],
    s = zb(r, t, i, n, e);
  ((t[o] = s), ws() && Fu(r, t, s, i), br(i, !1));
}
var zb = (e, n, t, r, o) => (_s(!0), ID(n[ie], r));
function im(e, n, t, r = '') {
  return Ct(e, Vn(), t) ? n + gr(t) + r : ct;
}
function G(e) {
  return (Ge('', e), G);
}
function Ge(e, n, t) {
  let r = $(),
    o = im(r, e, n, t);
  return (o !== ct && Gb(r, fn(), o), Ge);
}
function Gb(e, n, t) {
  let r = hl(n, e);
  wD(e[ie], r, t);
}
function Ar(e) {
  return Ct($(), Vn(), e) ? gr(e) : ct;
}
function Xu(e, n, t = '') {
  return im($(), e, n, t);
}
function ed(e, n, t, r) {
  return am($(), xo(), e, n, t, r);
}
function td(e, n, t, r, o) {
  return cm($(), xo(), e, n, t, r, o);
}
function sm(e, n) {
  let t = e[n];
  return t === ct ? void 0 : t;
}
function am(e, n, t, r, o, i) {
  let s = n + t;
  return Ct(e, s, o) ? Hg(e, s + 1, i ? r.call(i, o) : r(o)) : sm(e, s + 1);
}
function cm(e, n, t, r, o, i, s) {
  let a = n + t;
  return BC(e, a, o, i) ? Hg(e, a + 2, s ? r.call(s, o, i) : r(o, i)) : sm(e, a + 2);
}
function H(e, n) {
  let t = $e(),
    r,
    o = e + de;
  t.firstCreatePass
    ? ((r = Wb(n, t.pipeRegistry)),
      (t.data[o] = r),
      r.onDestroy && (t.destroyHooks ??= []).push(o, r.onDestroy))
    : (r = t.data[o]);
  let i = r.factory || (r.factory = sn(r.type, !0)),
    s,
    a = Se(Ee);
  try {
    let c = js(!1),
      l = i();
    return (js(c), ml(t, $(), o, l), l);
  } finally {
    Se(a);
  }
}
function Wb(e, n) {
  if (n)
    for (let t = n.length - 1; t >= 0; t--) {
      let r = n[t];
      if (e === r.name) return r;
    }
}
function Z(e, n, t) {
  let r = e + de,
    o = $(),
    i = gl(o, r);
  return lm(o, r) ? am(o, xo(), n, i.transform, t, i) : i.transform(t);
}
function Qn(e, n, t, r) {
  let o = e + de,
    i = $(),
    s = gl(i, o);
  return lm(i, o) ? cm(i, xo(), n, s.transform, t, r, s) : s.transform(t, r);
}
function lm(e, n) {
  return e[x].data[n].pure;
}
var Ks = class {
    ngModuleFactory;
    componentFactories;
    constructor(n, t) {
      ((this.ngModuleFactory = n), (this.componentFactories = t));
    }
  },
  nd = (() => {
    class e {
      compileModuleSync(t) {
        return new zs(t);
      }
      compileModuleAsync(t) {
        return Promise.resolve(this.compileModuleSync(t));
      }
      compileModuleAndAllComponentsSync(t) {
        let r = this.compileModuleSync(t),
          o = sl(t),
          i = cg(o.declarations).reduce((s, a) => {
            let c = ln(a);
            return (c && s.push(new Tr(c)), s);
          }, []);
        return new Ks(r, i);
      }
      compileModuleAndAllComponentsAsync(t) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(t));
      }
      clearCache() {}
      clearCacheFor(t) {}
      getModuleId(t) {}
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
var qb = (() => {
  class e {
    zone = h(ae);
    changeDetectionScheduler = h(cn);
    applicationRef = h(vn);
    applicationErrorHandler = h(ze);
    _onMicrotaskEmptySubscription;
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
          next: () => {
            this.changeDetectionScheduler.runningTick ||
              this.zone.run(() => {
                try {
                  ((this.applicationRef.dirtyFlags |= 1), this.applicationRef._tick());
                } catch (t) {
                  this.applicationErrorHandler(t);
                }
              });
          },
        }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
function um({ ngZoneFactory: e, ignoreChangesOutsideZone: n, scheduleInRootZone: t }) {
  return (
    (e ??= () => new ae(J(C({}, dm()), { scheduleInRootZone: t }))),
    [
      { provide: ae, useFactory: e },
      {
        provide: Lt,
        multi: !0,
        useFactory: () => {
          let r = h(qb, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: Lt,
        multi: !0,
        useFactory: () => {
          let r = h(Zb);
          return () => {
            r.initialize();
          };
        },
      },
      n === !0 ? { provide: Al, useValue: !0 } : [],
      { provide: Ol, useValue: t ?? Qg },
      {
        provide: ze,
        useFactory: () => {
          let r = h(ae),
            o = h(me),
            i;
          return (s) => {
            r.runOutsideAngular(() => {
              o.destroyed && !i
                ? setTimeout(() => {
                    throw s;
                  })
                : ((i ??= o.get(pt)), i.handleError(s));
            });
          };
        },
      },
    ]
  );
}
function dm(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var Zb = (() => {
  class e {
    subscription = new le();
    initialized = !1;
    zone = h(ae);
    pendingTasks = h(Et);
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let t = null;
      (!this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (t = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              (ae.assertNotInAngularZone(),
                queueMicrotask(() => {
                  t !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(t), (t = null));
                }));
            }),
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            (ae.assertInAngularZone(), (t ??= this.pendingTasks.add()));
          }),
        ));
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
var fm = (() => {
  class e {
    applicationErrorHandler = h(ze);
    appRef = h(vn);
    taskService = h(Et);
    ngZone = h(ae);
    zonelessEnabled = h(Ro);
    tracing = h(Yo, { optional: !0 });
    disableScheduling = h(Al, { optional: !0 }) ?? !1;
    zoneIsDefined = typeof Zone < 'u' && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new le();
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(Ws) : null;
    scheduleInRootZone =
      !this.zonelessEnabled && this.zoneIsDefined && (h(Ol, { optional: !0 }) ?? !1);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = !1;
    runningTick = !1;
    pendingRenderTaskId = null;
    constructor() {
      (this.subscriptions.add(
        this.appRef.afterTick.subscribe(() => {
          this.runningTick || this.cleanup();
        }),
      ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled && (this.ngZone instanceof qs || !this.zoneIsDefined)));
    }
    notify(t) {
      if (!this.zonelessEnabled && t === 5) return;
      let r = !1;
      switch (t) {
        case 0: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 3:
        case 2:
        case 4:
        case 5:
        case 1: {
          this.appRef.dirtyFlags |= 4;
          break;
        }
        case 6: {
          ((this.appRef.dirtyFlags |= 2), (r = !0));
          break;
        }
        case 12: {
          ((this.appRef.dirtyFlags |= 16), (r = !0));
          break;
        }
        case 13: {
          ((this.appRef.dirtyFlags |= 2), (r = !0));
          break;
        }
        case 11: {
          r = !0;
          break;
        }
        case 9:
        case 8:
        case 7:
        case 10:
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (
        ((this.appRef.tracingSnapshot =
          this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null),
        !this.shouldScheduleTick(r))
      )
        return;
      let o = this.useMicrotaskScheduler ? yh : Kg;
      ((this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() => o(() => this.tick())))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              o(() => this.tick()),
            )));
    }
    shouldScheduleTick(t) {
      return !(
        (this.disableScheduling && !t) ||
        this.appRef.destroyed ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(Ws + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
      }
      !this.zonelessEnabled && this.appRef.dirtyFlags & 7 && (this.appRef.dirtyFlags |= 1);
      let t = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            ((this.runningTick = !0), this.appRef._tick());
          },
          void 0,
          this.schedulerTickApplyArgs,
        );
      } catch (r) {
        (this.taskService.remove(t), this.applicationErrorHandler(r));
      } finally {
        this.cleanup();
      }
      ((this.useMicrotaskScheduler = !0),
        yh(() => {
          ((this.useMicrotaskScheduler = !1), this.taskService.remove(t));
        }));
    }
    ngOnDestroy() {
      (this.subscriptions.unsubscribe(), this.cleanup());
    }
    cleanup() {
      if (
        ((this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let t = this.pendingRenderTaskId;
        ((this.pendingRenderTaskId = null), this.taskService.remove(t));
      }
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
function Yb() {
  return (typeof $localize < 'u' && $localize.locale) || Qo;
}
var Ko = new T('', {
  providedIn: 'root',
  factory: () => h(Ko, { optional: !0, skipSelf: !0 }) || Yb(),
});
function Gt(e) {
  return ip(e);
}
var pm = class {
  [xe];
  constructor(n) {
    this[xe] = n;
  }
  destroy() {
    this[xe].destroy();
  }
};
var vm = Symbol('InputSignalNode#UNSET'),
  fI = J(C({}, Oi), {
    transformFn: void 0,
    applyValueToInputSignal(e, n) {
      or(e, n);
    },
  });
function ym(e, n) {
  let t = Object.create(fI);
  ((t.value = e), (t.transformFn = n?.transform));
  function r() {
    if ((so(t), t.value === vm)) {
      let o = null;
      throw new b(-950, o);
    }
    return t.value;
  }
  return ((r[xe] = t), r);
}
var pI = new T('');
pI.__NG_ELEMENT_ID__ = (e) => {
  let n = He();
  if (n === null) throw new b(204, !1);
  if (n.type & 2) return n.value;
  if (e & 8) return null;
  throw new b(204, !1);
};
function hm(e, n) {
  return ym(e, n);
}
function hI(e) {
  return ym(vm, e);
}
var Em = ((hm.required = hI), hm);
var rd = new T(''),
  gI = new T('');
function Jo(e) {
  return !e.moduleRef;
}
function mI(e) {
  let n = Jo(e) ? e.r3Injector : e.moduleRef.injector,
    t = n.get(ae);
  return t.run(() => {
    Jo(e) ? e.r3Injector.resolveInjectorInitializers() : e.moduleRef.resolveInjectorInitializers();
    let r = n.get(ze),
      o;
    if (
      (t.runOutsideAngular(() => {
        o = t.onError.subscribe({ next: r });
      }),
      Jo(e))
    ) {
      let i = () => n.destroy(),
        s = e.platformInjector.get(rd);
      (s.add(i),
        n.onDestroy(() => {
          (o.unsubscribe(), s.delete(i));
        }));
    } else {
      let i = () => e.moduleRef.destroy(),
        s = e.platformInjector.get(rd);
      (s.add(i),
        e.moduleRef.onDestroy(() => {
          (Po(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i));
        }));
    }
    return yI(r, t, () => {
      let i = n.get(Et),
        s = i.add(),
        a = n.get(Ku);
      return (
        a.runInitializers(),
        a.donePromise
          .then(() => {
            let c = n.get(Ko, Qo);
            if ((om(c || Qo), !n.get(gI, !0)))
              return Jo(e) ? n.get(vn) : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
            if (Jo(e)) {
              let u = n.get(vn);
              return (e.rootComponent !== void 0 && u.bootstrap(e.rootComponent), u);
            } else return (vI?.(e.moduleRef, e.allPlatformModules), e.moduleRef);
          })
          .finally(() => void i.remove(s))
      );
    });
  });
}
var vI;
function yI(e, n, t) {
  try {
    let r = t();
    return Rr(r)
      ? r.catch((o) => {
          throw (n.runOutsideAngular(() => e(o)), o);
        })
      : r;
  } catch (r) {
    throw (n.runOutsideAngular(() => e(r)), r);
  }
}
var ya = null;
function EI(e = [], n) {
  return nt.create({
    name: n,
    providers: [
      { provide: Eo, useValue: 'platform' },
      { provide: rd, useValue: new Set([() => (ya = null)]) },
      ...e,
    ],
  });
}
function DI(e = []) {
  if (ya) return ya;
  let n = EI(e);
  return ((ya = n), tm(), CI(n), n);
}
function CI(e) {
  let n = e.get(ea, null);
  Ie(e, () => {
    n?.forEach((t) => t());
  });
}
var Xo = (() => {
  class e {
    static __NG_ELEMENT_ID__ = bI;
  }
  return e;
})();
function bI(e) {
  return II(He(), $(), (e & 16) === 16);
}
function II(e, n, t) {
  if (dn(e) && !t) {
    let r = Je(e.index, n);
    return new Hn(r, r);
  } else if (e.type & 175) {
    let r = n[Ve];
    return new Hn(r, n);
  }
  return null;
}
var od = class {
    constructor() {}
    supports(n) {
      return n instanceof Map || Gu(n);
    }
    create() {
      return new id();
    }
  },
  id = class {
    _records = new Map();
    _mapHead = null;
    _appendAfter = null;
    _previousMapHead = null;
    _changesHead = null;
    _changesTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _removalsHead = null;
    _removalsTail = null;
    get isDirty() {
      return (
        this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null
      );
    }
    forEachItem(n) {
      let t;
      for (t = this._mapHead; t !== null; t = t._next) n(t);
    }
    forEachPreviousItem(n) {
      let t;
      for (t = this._previousMapHead; t !== null; t = t._nextPrevious) n(t);
    }
    forEachChangedItem(n) {
      let t;
      for (t = this._changesHead; t !== null; t = t._nextChanged) n(t);
    }
    forEachAddedItem(n) {
      let t;
      for (t = this._additionsHead; t !== null; t = t._nextAdded) n(t);
    }
    forEachRemovedItem(n) {
      let t;
      for (t = this._removalsHead; t !== null; t = t._nextRemoved) n(t);
    }
    diff(n) {
      if (!n) n = new Map();
      else if (!(n instanceof Map || Gu(n))) throw new b(900, !1);
      return this.check(n) ? this : null;
    }
    onDestroy() {}
    check(n) {
      this._reset();
      let t = this._mapHead;
      if (
        ((this._appendAfter = null),
        this._forEach(n, (r, o) => {
          if (t && t.key === o)
            (this._maybeAddToChanges(t, r), (this._appendAfter = t), (t = t._next));
          else {
            let i = this._getOrCreateRecordForKey(o, r);
            t = this._insertBeforeOrAppend(t, i);
          }
        }),
        t)
      ) {
        (t._prev && (t._prev._next = null), (this._removalsHead = t));
        for (let r = t; r !== null; r = r._nextRemoved)
          (r === this._mapHead && (this._mapHead = null),
            this._records.delete(r.key),
            (r._nextRemoved = r._next),
            (r.previousValue = r.currentValue),
            (r.currentValue = null),
            (r._prev = null),
            (r._next = null));
      }
      return (
        this._changesTail && (this._changesTail._nextChanged = null),
        this._additionsTail && (this._additionsTail._nextAdded = null),
        this.isDirty
      );
    }
    _insertBeforeOrAppend(n, t) {
      if (n) {
        let r = n._prev;
        return (
          (t._next = n),
          (t._prev = r),
          (n._prev = t),
          r && (r._next = t),
          n === this._mapHead && (this._mapHead = t),
          (this._appendAfter = n),
          n
        );
      }
      return (
        this._appendAfter
          ? ((this._appendAfter._next = t), (t._prev = this._appendAfter))
          : (this._mapHead = t),
        (this._appendAfter = t),
        null
      );
    }
    _getOrCreateRecordForKey(n, t) {
      if (this._records.has(n)) {
        let o = this._records.get(n);
        this._maybeAddToChanges(o, t);
        let i = o._prev,
          s = o._next;
        return (i && (i._next = s), s && (s._prev = i), (o._next = null), (o._prev = null), o);
      }
      let r = new sd(n);
      return (this._records.set(n, r), (r.currentValue = t), this._addToAdditions(r), r);
    }
    _reset() {
      if (this.isDirty) {
        let n;
        for (
          this._previousMapHead = this._mapHead, n = this._previousMapHead;
          n !== null;
          n = n._next
        )
          n._nextPrevious = n._next;
        for (n = this._changesHead; n !== null; n = n._nextChanged)
          n.previousValue = n.currentValue;
        for (n = this._additionsHead; n != null; n = n._nextAdded) n.previousValue = n.currentValue;
        ((this._changesHead = this._changesTail = null),
          (this._additionsHead = this._additionsTail = null),
          (this._removalsHead = null));
      }
    }
    _maybeAddToChanges(n, t) {
      Object.is(t, n.currentValue) ||
        ((n.previousValue = n.currentValue), (n.currentValue = t), this._addToChanges(n));
    }
    _addToAdditions(n) {
      this._additionsHead === null
        ? (this._additionsHead = this._additionsTail = n)
        : ((this._additionsTail._nextAdded = n), (this._additionsTail = n));
    }
    _addToChanges(n) {
      this._changesHead === null
        ? (this._changesHead = this._changesTail = n)
        : ((this._changesTail._nextChanged = n), (this._changesTail = n));
    }
    _forEach(n, t) {
      n instanceof Map ? n.forEach(t) : Object.keys(n).forEach((r) => t(n[r], r));
    }
  },
  sd = class {
    key;
    previousValue = null;
    currentValue = null;
    _nextPrevious = null;
    _next = null;
    _prev = null;
    _nextAdded = null;
    _nextRemoved = null;
    _nextChanged = null;
    constructor(n) {
      this.key = n;
    }
  };
function gm() {
  return new ad([new od()]);
}
var ad = (() => {
  class e {
    static ɵprov = w({ token: e, providedIn: 'root', factory: gm });
    factories;
    constructor(t) {
      this.factories = t;
    }
    static create(t, r) {
      if (r) {
        let o = r.factories.slice();
        t = t.concat(o);
      }
      return new e(t);
    }
    static extend(t) {
      return {
        provide: e,
        useFactory: () => {
          let r = h(e, { optional: !0, skipSelf: !0 });
          return e.create(t, r || gm());
        },
      };
    }
    find(t) {
      let r = this.factories.find((o) => o.supports(t));
      if (r) return r;
      throw new b(901, !1);
    }
  }
  return e;
})();
function Dm(e) {
  let { rootComponent: n, appProviders: t, platformProviders: r, platformRef: o } = e;
  Y(8);
  try {
    let i = o?.injector ?? DI(r),
      s = [um({}), { provide: cn, useExisting: fm }, Wp, ...(t || [])],
      a = new Vo({ providers: s, parent: i, debugName: '', runEnvironmentInitializers: !1 });
    return mI({ r3Injector: a.injector, platformInjector: i, rootComponent: n });
  } catch (i) {
    return Promise.reject(i);
  } finally {
    Y(9);
  }
}
var Im = null;
function Wt() {
  return Im;
}
function cd(e) {
  Im ??= e;
}
var ei = class {},
  ld = (() => {
    class e {
      historyGo(t) {
        throw new Error('');
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: () => h(wm), providedIn: 'platform' });
    }
    return e;
  })();
var wm = (() => {
  class e extends ld {
    _location;
    _history;
    _doc = h(fe);
    constructor() {
      (super(), (this._location = window.location), (this._history = window.history));
    }
    getBaseHrefFromDOM() {
      return Wt().getBaseHref(this._doc);
    }
    onPopState(t) {
      let r = Wt().getGlobalEventTarget(this._doc, 'window');
      return (r.addEventListener('popstate', t, !1), () => r.removeEventListener('popstate', t));
    }
    onHashChange(t) {
      let r = Wt().getGlobalEventTarget(this._doc, 'window');
      return (
        r.addEventListener('hashchange', t, !1),
        () => r.removeEventListener('hashchange', t)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(t) {
      this._location.pathname = t;
    }
    pushState(t, r, o) {
      this._history.pushState(t, r, o);
    }
    replaceState(t, r, o) {
      this._history.replaceState(t, r, o);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(t = 0) {
      this._history.go(t);
    }
    getState() {
      return this._history.state;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = w({ token: e, factory: () => new e(), providedIn: 'platform' });
  }
  return e;
})();
function _m(e, n) {
  return e
    ? n
      ? e.endsWith('/')
        ? n.startsWith('/')
          ? e + n.slice(1)
          : e + n
        : n.startsWith('/')
          ? e + n
          : `${e}/${n}`
      : e
    : n;
}
function Cm(e) {
  let n = e.search(/#|\?|$/);
  return e[n - 1] === '/' ? e.slice(0, n - 1) + e.slice(n) : e;
}
function yn(e) {
  return e && e[0] !== '?' ? `?${e}` : e;
}
var Ea = (() => {
    class e {
      historyGo(t) {
        throw new Error('');
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: () => h(Sm), providedIn: 'root' });
    }
    return e;
  })(),
  Tm = new T(''),
  Sm = (() => {
    class e extends Ea {
      _platformLocation;
      _baseHref;
      _removeListenerFns = [];
      constructor(t, r) {
        (super(),
          (this._platformLocation = t),
          (this._baseHref =
            r ?? this._platformLocation.getBaseHrefFromDOM() ?? h(fe).location?.origin ?? ''));
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()();
      }
      onPopState(t) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(t),
          this._platformLocation.onHashChange(t),
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(t) {
        return _m(this._baseHref, t);
      }
      path(t = !1) {
        let r = this._platformLocation.pathname + yn(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && t ? `${r}${o}` : r;
      }
      pushState(t, r, o, i) {
        let s = this.prepareExternalUrl(o + yn(i));
        this._platformLocation.pushState(t, r, s);
      }
      replaceState(t, r, o, i) {
        let s = this.prepareExternalUrl(o + yn(i));
        this._platformLocation.replaceState(t, r, s);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(t = 0) {
        this._platformLocation.historyGo?.(t);
      }
      static ɵfac = function (r) {
        return new (r || e)(M(ld), M(Tm, 8));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  kr = (() => {
    class e {
      _subject = new X();
      _basePath;
      _locationStrategy;
      _urlChangeListeners = [];
      _urlChangeSubscription = null;
      constructor(t) {
        this._locationStrategy = t;
        let r = this._locationStrategy.getBaseHref();
        ((this._basePath = TI(Cm(bm(r)))),
          this._locationStrategy.onPopState((o) => {
            this._subject.next({ url: this.path(!0), pop: !0, state: o.state, type: o.type });
          }));
      }
      ngOnDestroy() {
        (this._urlChangeSubscription?.unsubscribe(), (this._urlChangeListeners = []));
      }
      path(t = !1) {
        return this.normalize(this._locationStrategy.path(t));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(t, r = '') {
        return this.path() == this.normalize(t + yn(r));
      }
      normalize(t) {
        return e.stripTrailingSlash(_I(this._basePath, bm(t)));
      }
      prepareExternalUrl(t) {
        return (t && t[0] !== '/' && (t = '/' + t), this._locationStrategy.prepareExternalUrl(t));
      }
      go(t, r = '', o = null) {
        (this._locationStrategy.pushState(o, '', t, r),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(t + yn(r)), o));
      }
      replaceState(t, r = '', o = null) {
        (this._locationStrategy.replaceState(o, '', t, r),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(t + yn(r)), o));
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(t = 0) {
        this._locationStrategy.historyGo?.(t);
      }
      onUrlChange(t) {
        return (
          this._urlChangeListeners.push(t),
          (this._urlChangeSubscription ??= this.subscribe((r) => {
            this._notifyUrlChangeListeners(r.url, r.state);
          })),
          () => {
            let r = this._urlChangeListeners.indexOf(t);
            (this._urlChangeListeners.splice(r, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(), (this._urlChangeSubscription = null)));
          }
        );
      }
      _notifyUrlChangeListeners(t = '', r) {
        this._urlChangeListeners.forEach((o) => o(t, r));
      }
      subscribe(t, r, o) {
        return this._subject.subscribe({ next: t, error: r ?? void 0, complete: o ?? void 0 });
      }
      static normalizeQueryParams = yn;
      static joinWithSlash = _m;
      static stripTrailingSlash = Cm;
      static ɵfac = function (r) {
        return new (r || e)(M(Ea));
      };
      static ɵprov = w({ token: e, factory: () => wI(), providedIn: 'root' });
    }
    return e;
  })();
function wI() {
  return new kr(M(Ea));
}
function _I(e, n) {
  if (!e || !n.startsWith(e)) return n;
  let t = n.substring(e.length);
  return t === '' || ['/', ';', '?', '#'].includes(t[0]) ? t : n;
}
function bm(e) {
  return e.replace(/\/index.html$/, '');
}
function TI(e) {
  if (new RegExp('^(https?:)?//').test(e)) {
    let [, t] = e.split(/\/\/[^\/]+/);
    return t;
  }
  return e;
}
var fd = (function (e) {
  return (
    (e[(e.Decimal = 0)] = 'Decimal'),
    (e[(e.Percent = 1)] = 'Percent'),
    (e[(e.Currency = 2)] = 'Currency'),
    (e[(e.Scientific = 3)] = 'Scientific'),
    e
  );
})(fd || {});
var _t = {
  Decimal: 0,
  Group: 1,
  List: 2,
  PercentSign: 3,
  PlusSign: 4,
  MinusSign: 5,
  Exponential: 6,
  SuperscriptingExponent: 7,
  PerMille: 8,
  Infinity: 9,
  NaN: 10,
  TimeSeparator: 11,
  CurrencyDecimal: 12,
  CurrencyGroup: 13,
};
function Pr(e, n) {
  let t = va(e),
    r = t[Yn.NumberSymbols][n];
  if (typeof r > 'u') {
    if (n === _t.CurrencyDecimal) return t[Yn.NumberSymbols][_t.Decimal];
    if (n === _t.CurrencyGroup) return t[Yn.NumberSymbols][_t.Group];
  }
  return r;
}
function Nm(e, n) {
  return va(e)[Yn.NumberFormats][n];
}
var SI = /^(\d+)?\.((\d+)(-(\d+))?)?$/,
  Mm = 22,
  Da = '.',
  ti = '0',
  MI = ';',
  NI = ',',
  ud = '#';
function xI(e, n, t, r, o, i, s = !1) {
  let a = '',
    c = !1;
  if (!isFinite(e)) a = Pr(t, _t.Infinity);
  else {
    let l = OI(e);
    s && (l = AI(l));
    let u = n.minInt,
      d = n.minFrac,
      p = n.maxFrac;
    if (i) {
      let z = i.match(SI);
      if (z === null) throw new b(2306, !1);
      let De = z[1],
        ee = z[3],
        je = z[5];
      (De != null && (u = dd(De)),
        ee != null && (d = dd(ee)),
        je != null ? (p = dd(je)) : ee != null && d > p && (p = d));
    }
    kI(l, d, p);
    let f = l.digits,
      m = l.integerLen,
      _ = l.exponent,
      I = [];
    for (c = f.every((z) => !z); m < u; m++) f.unshift(0);
    for (; m < 0; m++) f.unshift(0);
    m > 0 ? (I = f.splice(m, f.length)) : ((I = f), (f = [0]));
    let D = [];
    for (
      f.length >= n.lgSize && D.unshift(f.splice(-n.lgSize, f.length).join(''));
      f.length > n.gSize;

    )
      D.unshift(f.splice(-n.gSize, f.length).join(''));
    (f.length && D.unshift(f.join('')),
      (a = D.join(Pr(t, r))),
      I.length && (a += Pr(t, o) + I.join('')),
      _ && (a += Pr(t, _t.Exponential) + '+' + _));
  }
  return (e < 0 && !c ? (a = n.negPre + a + n.negSuf) : (a = n.posPre + a + n.posSuf), a);
}
function xm(e, n, t) {
  let r = Nm(n, fd.Decimal),
    o = RI(r, Pr(n, _t.MinusSign));
  return xI(e, o, n, _t.Group, _t.Decimal, t);
}
function RI(e, n = '-') {
  let t = {
      minInt: 1,
      minFrac: 0,
      maxFrac: 0,
      posPre: '',
      posSuf: '',
      negPre: '',
      negSuf: '',
      gSize: 0,
      lgSize: 0,
    },
    r = e.split(MI),
    o = r[0],
    i = r[1],
    s =
      o.indexOf(Da) !== -1
        ? o.split(Da)
        : [o.substring(0, o.lastIndexOf(ti) + 1), o.substring(o.lastIndexOf(ti) + 1)],
    a = s[0],
    c = s[1] || '';
  t.posPre = a.substring(0, a.indexOf(ud));
  for (let u = 0; u < c.length; u++) {
    let d = c.charAt(u);
    d === ti ? (t.minFrac = t.maxFrac = u + 1) : d === ud ? (t.maxFrac = u + 1) : (t.posSuf += d);
  }
  let l = a.split(NI);
  if (
    ((t.gSize = l[1] ? l[1].length : 0), (t.lgSize = l[2] || l[1] ? (l[2] || l[1]).length : 0), i)
  ) {
    let u = o.length - t.posPre.length - t.posSuf.length,
      d = i.indexOf(ud);
    ((t.negPre = i.substring(0, d).replace(/'/g, '')),
      (t.negSuf = i.slice(d + u).replace(/'/g, '')));
  } else ((t.negPre = n + t.posPre), (t.negSuf = t.posSuf));
  return t;
}
function AI(e) {
  if (e.digits[0] === 0) return e;
  let n = e.digits.length - e.integerLen;
  return (
    e.exponent
      ? (e.exponent += 2)
      : (n === 0 ? e.digits.push(0, 0) : n === 1 && e.digits.push(0), (e.integerLen += 2)),
    e
  );
}
function OI(e) {
  let n = Math.abs(e) + '',
    t = 0,
    r,
    o,
    i,
    s,
    a;
  for (
    (o = n.indexOf(Da)) > -1 && (n = n.replace(Da, '')),
      (i = n.search(/e/i)) > 0
        ? (o < 0 && (o = i), (o += +n.slice(i + 1)), (n = n.substring(0, i)))
        : o < 0 && (o = n.length),
      i = 0;
    n.charAt(i) === ti;
    i++
  );
  if (i === (a = n.length)) ((r = [0]), (o = 1));
  else {
    for (a--; n.charAt(a) === ti; ) a--;
    for (o -= i, r = [], s = 0; i <= a; i++, s++) r[s] = Number(n.charAt(i));
  }
  return (
    o > Mm && ((r = r.splice(0, Mm - 1)), (t = o - 1), (o = 1)),
    { digits: r, exponent: t, integerLen: o }
  );
}
function kI(e, n, t) {
  if (n > t) throw new b(2307, !1);
  let r = e.digits,
    o = r.length - e.integerLen,
    i = Math.min(Math.max(n, o), t),
    s = i + e.integerLen,
    a = r[s];
  if (s > 0) {
    r.splice(Math.max(e.integerLen, s));
    for (let d = s; d < r.length; d++) r[d] = 0;
  } else {
    ((o = Math.max(0, o)), (e.integerLen = 1), (r.length = Math.max(1, (s = i + 1))), (r[0] = 0));
    for (let d = 1; d < s; d++) r[d] = 0;
  }
  if (a >= 5)
    if (s - 1 < 0) {
      for (let d = 0; d > s; d--) (r.unshift(0), e.integerLen++);
      (r.unshift(1), e.integerLen++);
    } else r[s - 1]++;
  for (; o < Math.max(0, i); o++) r.push(0);
  let c = i !== 0,
    l = n + e.integerLen,
    u = r.reduceRight(function (d, p, f, m) {
      return (
        (p = p + d),
        (m[f] = p < 10 ? p : p - 10),
        c && (m[f] === 0 && f >= l ? m.pop() : (c = !1)),
        p >= 10 ? 1 : 0
      );
    }, 0);
  u && (r.unshift(u), e.integerLen++);
}
function dd(e) {
  let n = parseInt(e);
  if (isNaN(n)) throw new b(2305, !1);
  return n;
}
var pd = (() => {
  class e {
    _ngEl;
    _differs;
    _renderer;
    _ngStyle = null;
    _differ = null;
    constructor(t, r, o) {
      ((this._ngEl = t), (this._differs = r), (this._renderer = o));
    }
    set ngStyle(t) {
      ((this._ngStyle = t), !this._differ && t && (this._differ = this._differs.find(t).create()));
    }
    ngDoCheck() {
      if (this._differ) {
        let t = this._differ.diff(this._ngStyle);
        t && this._applyChanges(t);
      }
    }
    _setStyle(t, r) {
      let [o, i] = t.split('.'),
        s = o.indexOf('-') === -1 ? void 0 : st.DashCase;
      r != null
        ? this._renderer.setStyle(this._ngEl.nativeElement, o, i ? `${r}${i}` : r, s)
        : this._renderer.removeStyle(this._ngEl.nativeElement, o, s);
    }
    _applyChanges(t) {
      (t.forEachRemovedItem((r) => this._setStyle(r.key, null)),
        t.forEachAddedItem((r) => this._setStyle(r.key, r.currentValue)),
        t.forEachChangedItem((r) => this._setStyle(r.key, r.currentValue)));
    }
    static ɵfac = function (r) {
      return new (r || e)(Ee(Ho), Ee(ad), Ee(zu));
    };
    static ɵdir = Nr({ type: e, selectors: [['', 'ngStyle', '']], inputs: { ngStyle: 'ngStyle' } });
  }
  return e;
})();
function Rm(e, n) {
  return new b(2100, !1);
}
var hd = (() => {
  class e {
    transform(t) {
      if (t == null) return null;
      if (typeof t != 'string') throw Rm(e, t);
      return t.toUpperCase();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵpipe = xr({ name: 'uppercase', type: e, pure: !0 });
  }
  return e;
})();
var gd = (() => {
  class e {
    _locale;
    constructor(t) {
      this._locale = t;
    }
    transform(t, r, o) {
      if (!PI(t)) return null;
      o ||= this._locale;
      try {
        let i = LI(t);
        return xm(i, o, r);
      } catch (i) {
        throw Rm(e, i.message);
      }
    }
    static ɵfac = function (r) {
      return new (r || e)(Ee(Ko, 16));
    };
    static ɵpipe = xr({ name: 'number', type: e, pure: !0 });
  }
  return e;
})();
function PI(e) {
  return !(e == null || e === '' || e !== e);
}
function LI(e) {
  if (typeof e == 'string' && !isNaN(Number(e) - parseFloat(e))) return Number(e);
  if (typeof e != 'number') throw new b(2309, !1);
  return e;
}
var Le = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = Ut({ type: e });
    static ɵinj = ht({});
  }
  return e;
})();
function ni(e, n) {
  n = encodeURIComponent(n);
  for (let t of e.split(';')) {
    let r = t.indexOf('='),
      [o, i] = r == -1 ? [t, ''] : [t.slice(0, r), t.slice(r + 1)];
    if (o.trim() === n) return decodeURIComponent(i);
  }
  return null;
}
var Kn = class {};
var Am = 'browser';
var ba = new T(''),
  Cd = (() => {
    class e {
      _zone;
      _plugins;
      _eventNameToPlugin = new Map();
      constructor(t, r) {
        ((this._zone = r),
          t.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = t.slice().reverse()));
      }
      addEventListener(t, r, o, i) {
        return this._findPluginFor(r).addEventListener(t, r, o, i);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(t) {
        let r = this._eventNameToPlugin.get(t);
        if (r) return r;
        if (((r = this._plugins.find((i) => i.supports(t))), !r)) throw new b(5101, !1);
        return (this._eventNameToPlugin.set(t, r), r);
      }
      static ɵfac = function (r) {
        return new (r || e)(M(ba), M(ae));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  ri = class {
    _doc;
    constructor(n) {
      this._doc = n;
    }
    manager;
  },
  vd = 'ng-app-id';
function Om(e) {
  for (let n of e) n.remove();
}
function km(e, n) {
  let t = n.createElement('style');
  return ((t.textContent = e), t);
}
function jI(e, n, t, r) {
  let o = e.head?.querySelectorAll(`style[${vd}="${n}"],link[${vd}="${n}"]`);
  if (o)
    for (let i of o)
      (i.removeAttribute(vd),
        i instanceof HTMLLinkElement
          ? r.set(i.href.slice(i.href.lastIndexOf('/') + 1), { usage: 0, elements: [i] })
          : i.textContent && t.set(i.textContent, { usage: 0, elements: [i] }));
}
function Ed(e, n) {
  let t = n.createElement('link');
  return (t.setAttribute('rel', 'stylesheet'), t.setAttribute('href', e), t);
}
var bd = (() => {
    class e {
      doc;
      appId;
      nonce;
      inline = new Map();
      external = new Map();
      hosts = new Set();
      constructor(t, r, o, i = {}) {
        ((this.doc = t),
          (this.appId = r),
          (this.nonce = o),
          jI(t, r, this.inline, this.external),
          this.hosts.add(t.head));
      }
      addStyles(t, r) {
        for (let o of t) this.addUsage(o, this.inline, km);
        r?.forEach((o) => this.addUsage(o, this.external, Ed));
      }
      removeStyles(t, r) {
        for (let o of t) this.removeUsage(o, this.inline);
        r?.forEach((o) => this.removeUsage(o, this.external));
      }
      addUsage(t, r, o) {
        let i = r.get(t);
        i
          ? i.usage++
          : r.set(t, {
              usage: 1,
              elements: [...this.hosts].map((s) => this.addElement(s, o(t, this.doc))),
            });
      }
      removeUsage(t, r) {
        let o = r.get(t);
        o && (o.usage--, o.usage <= 0 && (Om(o.elements), r.delete(t)));
      }
      ngOnDestroy() {
        for (let [, { elements: t }] of [...this.inline, ...this.external]) Om(t);
        this.hosts.clear();
      }
      addHost(t) {
        this.hosts.add(t);
        for (let [r, { elements: o }] of this.inline) o.push(this.addElement(t, km(r, this.doc)));
        for (let [r, { elements: o }] of this.external) o.push(this.addElement(t, Ed(r, this.doc)));
      }
      removeHost(t) {
        this.hosts.delete(t);
      }
      addElement(t, r) {
        return (this.nonce && r.setAttribute('nonce', this.nonce), t.appendChild(r));
      }
      static ɵfac = function (r) {
        return new (r || e)(M(fe), M(Xs), M(ta, 8), M(Mr));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  yd = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/Math/MathML',
  },
  Id = /%COMP%/g;
var Lm = '%COMP%',
  BI = `_nghost-${Lm}`,
  VI = `_ngcontent-${Lm}`,
  UI = !0,
  $I = new T('', { providedIn: 'root', factory: () => UI });
function HI(e) {
  return VI.replace(Id, e);
}
function zI(e) {
  return BI.replace(Id, e);
}
function Fm(e, n) {
  return n.map((t) => t.replace(Id, e));
}
var wd = (() => {
    class e {
      eventManager;
      sharedStylesHost;
      appId;
      removeStylesOnCompDestroy;
      doc;
      platformId;
      ngZone;
      nonce;
      tracingService;
      rendererByCompId = new Map();
      defaultRenderer;
      platformIsServer;
      constructor(t, r, o, i, s, a, c, l = null, u = null) {
        ((this.eventManager = t),
          (this.sharedStylesHost = r),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = i),
          (this.doc = s),
          (this.platformId = a),
          (this.ngZone = c),
          (this.nonce = l),
          (this.tracingService = u),
          (this.platformIsServer = !1),
          (this.defaultRenderer = new oi(t, s, c, this.platformIsServer, this.tracingService)));
      }
      createRenderer(t, r) {
        if (!t || !r) return this.defaultRenderer;
        let o = this.getOrCreateRenderer(t, r);
        return (o instanceof Ca ? o.applyToHost(t) : o instanceof ii && o.applyStyles(), o);
      }
      getOrCreateRenderer(t, r) {
        let o = this.rendererByCompId,
          i = o.get(r.id);
        if (!i) {
          let s = this.doc,
            a = this.ngZone,
            c = this.eventManager,
            l = this.sharedStylesHost,
            u = this.removeStylesOnCompDestroy,
            d = this.platformIsServer,
            p = this.tracingService;
          switch (r.encapsulation) {
            case Ft.Emulated:
              i = new Ca(c, l, r, this.appId, u, s, a, d, p);
              break;
            case Ft.ShadowDom:
              return new Dd(c, l, t, r, s, a, this.nonce, d, p);
            default:
              i = new ii(c, l, r, u, s, a, d, p);
              break;
          }
          o.set(r.id, i);
        }
        return i;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
      componentReplaced(t) {
        this.rendererByCompId.delete(t);
      }
      static ɵfac = function (r) {
        return new (r || e)(M(Cd), M(bd), M(Xs), M($I), M(fe), M(Mr), M(ae), M(ta), M(Yo, 8));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  oi = class {
    eventManager;
    doc;
    ngZone;
    platformIsServer;
    tracingService;
    data = Object.create(null);
    throwOnSyntheticProps = !0;
    constructor(n, t, r, o, i) {
      ((this.eventManager = n),
        (this.doc = t),
        (this.ngZone = r),
        (this.platformIsServer = o),
        (this.tracingService = i));
    }
    destroy() {}
    destroyNode = null;
    createElement(n, t) {
      return t ? this.doc.createElementNS(yd[t] || t, n) : this.doc.createElement(n);
    }
    createComment(n) {
      return this.doc.createComment(n);
    }
    createText(n) {
      return this.doc.createTextNode(n);
    }
    appendChild(n, t) {
      (Pm(n) ? n.content : n).appendChild(t);
    }
    insertBefore(n, t, r) {
      n && (Pm(n) ? n.content : n).insertBefore(t, r);
    }
    removeChild(n, t) {
      t.remove();
    }
    selectRootElement(n, t) {
      let r = typeof n == 'string' ? this.doc.querySelector(n) : n;
      if (!r) throw new b(-5104, !1);
      return (t || (r.textContent = ''), r);
    }
    parentNode(n) {
      return n.parentNode;
    }
    nextSibling(n) {
      return n.nextSibling;
    }
    setAttribute(n, t, r, o) {
      if (o) {
        t = o + ':' + t;
        let i = yd[o];
        i ? n.setAttributeNS(i, t, r) : n.setAttribute(t, r);
      } else n.setAttribute(t, r);
    }
    removeAttribute(n, t, r) {
      if (r) {
        let o = yd[r];
        o ? n.removeAttributeNS(o, t) : n.removeAttribute(`${r}:${t}`);
      } else n.removeAttribute(t);
    }
    addClass(n, t) {
      n.classList.add(t);
    }
    removeClass(n, t) {
      n.classList.remove(t);
    }
    setStyle(n, t, r, o) {
      o & (st.DashCase | st.Important)
        ? n.style.setProperty(t, r, o & st.Important ? 'important' : '')
        : (n.style[t] = r);
    }
    removeStyle(n, t, r) {
      r & st.DashCase ? n.style.removeProperty(t) : (n.style[t] = '');
    }
    setProperty(n, t, r) {
      n != null && (n[t] = r);
    }
    setValue(n, t) {
      n.nodeValue = t;
    }
    listen(n, t, r, o) {
      if (typeof n == 'string' && ((n = Wt().getGlobalEventTarget(this.doc, n)), !n))
        throw new b(5102, !1);
      let i = this.decoratePreventDefault(r);
      return (
        this.tracingService?.wrapEventListener &&
          (i = this.tracingService.wrapEventListener(n, t, i)),
        this.eventManager.addEventListener(n, t, i, o)
      );
    }
    decoratePreventDefault(n) {
      return (t) => {
        if (t === '__ngUnwrap__') return n;
        n(t) === !1 && t.preventDefault();
      };
    }
  };
function Pm(e) {
  return e.tagName === 'TEMPLATE' && e.content !== void 0;
}
var Dd = class extends oi {
    sharedStylesHost;
    hostEl;
    shadowRoot;
    constructor(n, t, r, o, i, s, a, c, l) {
      (super(n, i, s, c, l),
        (this.sharedStylesHost = t),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot));
      let u = o.styles;
      u = Fm(o.id, u);
      for (let p of u) {
        let f = document.createElement('style');
        (a && f.setAttribute('nonce', a), (f.textContent = p), this.shadowRoot.appendChild(f));
      }
      let d = o.getExternalStyles?.();
      if (d)
        for (let p of d) {
          let f = Ed(p, i);
          (a && f.setAttribute('nonce', a), this.shadowRoot.appendChild(f));
        }
    }
    nodeOrShadowRoot(n) {
      return n === this.hostEl ? this.shadowRoot : n;
    }
    appendChild(n, t) {
      return super.appendChild(this.nodeOrShadowRoot(n), t);
    }
    insertBefore(n, t, r) {
      return super.insertBefore(this.nodeOrShadowRoot(n), t, r);
    }
    removeChild(n, t) {
      return super.removeChild(null, t);
    }
    parentNode(n) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  ii = class extends oi {
    sharedStylesHost;
    removeStylesOnCompDestroy;
    styles;
    styleUrls;
    constructor(n, t, r, o, i, s, a, c, l) {
      (super(n, i, s, a, c), (this.sharedStylesHost = t), (this.removeStylesOnCompDestroy = o));
      let u = r.styles;
      ((this.styles = l ? Fm(l, u) : u), (this.styleUrls = r.getExternalStyles?.(l)));
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        sa.size === 0 &&
        this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
    }
  },
  Ca = class extends ii {
    contentAttr;
    hostAttr;
    constructor(n, t, r, o, i, s, a, c, l) {
      let u = o + '-' + r.id;
      (super(n, t, r, i, s, a, c, l, u), (this.contentAttr = HI(u)), (this.hostAttr = zI(u)));
    }
    applyToHost(n) {
      (this.applyStyles(), this.setAttribute(n, this.hostAttr, ''));
    }
    createElement(n, t) {
      let r = super.createElement(n, t);
      return (super.setAttribute(r, this.contentAttr, ''), r);
    }
  };
var Ia = class e extends ei {
    supportsDOMEvents = !0;
    static makeCurrent() {
      cd(new e());
    }
    onAndCancel(n, t, r, o) {
      return (
        n.addEventListener(t, r, o),
        () => {
          n.removeEventListener(t, r, o);
        }
      );
    }
    dispatchEvent(n, t) {
      n.dispatchEvent(t);
    }
    remove(n) {
      n.remove();
    }
    createElement(n, t) {
      return ((t = t || this.getDefaultDocument()), t.createElement(n));
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument('fakeTitle');
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(n) {
      return n.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(n) {
      return n instanceof DocumentFragment;
    }
    getGlobalEventTarget(n, t) {
      return t === 'window' ? window : t === 'document' ? n : t === 'body' ? n.body : null;
    }
    getBaseHref(n) {
      let t = GI();
      return t == null ? null : WI(t);
    }
    resetBaseElement() {
      si = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(n) {
      return ni(document.cookie, n);
    }
  },
  si = null;
function GI() {
  return ((si = si || document.head.querySelector('base')), si ? si.getAttribute('href') : null);
}
function WI(e) {
  return new URL(e, document.baseURI).pathname;
}
var qI = (() => {
    class e {
      build() {
        return new XMLHttpRequest();
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Bm = (() => {
    class e extends ri {
      constructor(t) {
        super(t);
      }
      supports(t) {
        return !0;
      }
      addEventListener(t, r, o, i) {
        return (t.addEventListener(r, o, i), () => this.removeEventListener(t, r, o, i));
      }
      removeEventListener(t, r, o, i) {
        return t.removeEventListener(r, o, i);
      }
      static ɵfac = function (r) {
        return new (r || e)(M(fe));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  jm = ['alt', 'control', 'meta', 'shift'],
  ZI = {
    '\b': 'Backspace',
    '	': 'Tab',
    '\x7F': 'Delete',
    '\x1B': 'Escape',
    Del: 'Delete',
    Esc: 'Escape',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Menu: 'ContextMenu',
    Scroll: 'ScrollLock',
    Win: 'OS',
  },
  YI = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  Vm = (() => {
    class e extends ri {
      constructor(t) {
        super(t);
      }
      supports(t) {
        return e.parseEventName(t) != null;
      }
      addEventListener(t, r, o, i) {
        let s = e.parseEventName(r),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => Wt().onAndCancel(t, s.domEventName, a, i));
      }
      static parseEventName(t) {
        let r = t.toLowerCase().split('.'),
          o = r.shift();
        if (r.length === 0 || !(o === 'keydown' || o === 'keyup')) return null;
        let i = e._normalizeKey(r.pop()),
          s = '',
          a = r.indexOf('code');
        if (
          (a > -1 && (r.splice(a, 1), (s = 'code.')),
          jm.forEach((l) => {
            let u = r.indexOf(l);
            u > -1 && (r.splice(u, 1), (s += l + '.'));
          }),
          (s += i),
          r.length != 0 || i.length === 0)
        )
          return null;
        let c = {};
        return ((c.domEventName = o), (c.fullKey = s), c);
      }
      static matchEventFullKeyCode(t, r) {
        let o = ZI[t.key] || t.key,
          i = '';
        return (
          r.indexOf('code.') > -1 && ((o = t.code), (i = 'code.')),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === ' ' ? (o = 'space') : o === '.' && (o = 'dot'),
              jm.forEach((s) => {
                if (s !== o) {
                  let a = YI[s];
                  a(t) && (i += s + '.');
                }
              }),
              (i += o),
              i === r)
        );
      }
      static eventCallback(t, r, o) {
        return (i) => {
          e.matchEventFullKeyCode(i, t) && o.runGuarded(() => r(i));
        };
      }
      static _normalizeKey(t) {
        return t === 'esc' ? 'escape' : t;
      }
      static ɵfac = function (r) {
        return new (r || e)(M(fe));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })();
function _d(e, n, t) {
  let r = C({ rootComponent: e, platformRef: t?.platformRef }, QI(n));
  return Dm(r);
}
function QI(e) {
  return { appProviders: [...tw, ...(e?.providers ?? [])], platformProviders: ew };
}
function KI() {
  Ia.makeCurrent();
}
function JI() {
  return new pt();
}
function XI() {
  return (Iu(document), document);
}
var ew = [
  { provide: Mr, useValue: Am },
  { provide: ea, useValue: KI, multi: !0 },
  { provide: fe, useFactory: XI },
];
var tw = [
  { provide: Eo, useValue: 'root' },
  { provide: pt, useFactory: JI },
  { provide: ba, useClass: Bm, multi: !0, deps: [fe] },
  { provide: ba, useClass: Vm, multi: !0, deps: [fe] },
  wd,
  bd,
  Cd,
  { provide: zn, useExisting: wd },
  { provide: Kn, useClass: qI },
  [],
];
var Fr = class {},
  jr = class {},
  St = class e {
    headers;
    normalizedNames = new Map();
    lazyInit;
    lazyUpdate = null;
    constructor(n) {
      n
        ? typeof n == 'string'
          ? (this.lazyInit = () => {
              ((this.headers = new Map()),
                n
                  .split(
                    `
`,
                  )
                  .forEach((t) => {
                    let r = t.indexOf(':');
                    if (r > 0) {
                      let o = t.slice(0, r),
                        i = t.slice(r + 1).trim();
                      this.addHeaderEntry(o, i);
                    }
                  }));
            })
          : typeof Headers < 'u' && n instanceof Headers
            ? ((this.headers = new Map()),
              n.forEach((t, r) => {
                this.addHeaderEntry(r, t);
              }))
            : (this.lazyInit = () => {
                ((this.headers = new Map()),
                  Object.entries(n).forEach(([t, r]) => {
                    this.setHeaderEntries(t, r);
                  }));
              })
        : (this.headers = new Map());
    }
    has(n) {
      return (this.init(), this.headers.has(n.toLowerCase()));
    }
    get(n) {
      this.init();
      let t = this.headers.get(n.toLowerCase());
      return t && t.length > 0 ? t[0] : null;
    }
    keys() {
      return (this.init(), Array.from(this.normalizedNames.values()));
    }
    getAll(n) {
      return (this.init(), this.headers.get(n.toLowerCase()) || null);
    }
    append(n, t) {
      return this.clone({ name: n, value: t, op: 'a' });
    }
    set(n, t) {
      return this.clone({ name: n, value: t, op: 's' });
    }
    delete(n, t) {
      return this.clone({ name: n, value: t, op: 'd' });
    }
    maybeSetNormalizedName(n, t) {
      this.normalizedNames.has(t) || this.normalizedNames.set(t, n);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof e ? this.copyFrom(this.lazyInit) : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((n) => this.applyUpdate(n)), (this.lazyUpdate = null)));
    }
    copyFrom(n) {
      (n.init(),
        Array.from(n.headers.keys()).forEach((t) => {
          (this.headers.set(t, n.headers.get(t)),
            this.normalizedNames.set(t, n.normalizedNames.get(t)));
        }));
    }
    clone(n) {
      let t = new e();
      return (
        (t.lazyInit = this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this),
        (t.lazyUpdate = (this.lazyUpdate || []).concat([n])),
        t
      );
    }
    applyUpdate(n) {
      let t = n.name.toLowerCase();
      switch (n.op) {
        case 'a':
        case 's':
          let r = n.value;
          if ((typeof r == 'string' && (r = [r]), r.length === 0)) return;
          this.maybeSetNormalizedName(n.name, t);
          let o = (n.op === 'a' ? this.headers.get(t) : void 0) || [];
          (o.push(...r), this.headers.set(t, o));
          break;
        case 'd':
          let i = n.value;
          if (!i) (this.headers.delete(t), this.normalizedNames.delete(t));
          else {
            let s = this.headers.get(t);
            if (!s) return;
            ((s = s.filter((a) => i.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(t), this.normalizedNames.delete(t))
                : this.headers.set(t, s));
          }
          break;
      }
    }
    addHeaderEntry(n, t) {
      let r = n.toLowerCase();
      (this.maybeSetNormalizedName(n, r),
        this.headers.has(r) ? this.headers.get(r).push(t) : this.headers.set(r, [t]));
    }
    setHeaderEntries(n, t) {
      let r = (Array.isArray(t) ? t : [t]).map((i) => i.toString()),
        o = n.toLowerCase();
      (this.headers.set(o, r), this.maybeSetNormalizedName(n, o));
    }
    forEach(n) {
      (this.init(),
        Array.from(this.normalizedNames.keys()).forEach((t) =>
          n(this.normalizedNames.get(t), this.headers.get(t)),
        ));
    }
  };
var Ta = class {
  encodeKey(n) {
    return Um(n);
  }
  encodeValue(n) {
    return Um(n);
  }
  decodeKey(n) {
    return decodeURIComponent(n);
  }
  decodeValue(n) {
    return decodeURIComponent(n);
  }
};
function nw(e, n) {
  let t = new Map();
  return (
    e.length > 0 &&
      e
        .replace(/^\?/, '')
        .split('&')
        .forEach((o) => {
          let i = o.indexOf('='),
            [s, a] =
              i == -1
                ? [n.decodeKey(o), '']
                : [n.decodeKey(o.slice(0, i)), n.decodeValue(o.slice(i + 1))],
            c = t.get(s) || [];
          (c.push(a), t.set(s, c));
        }),
    t
  );
}
var rw = /%(\d[a-f0-9])/gi,
  ow = { 40: '@', '3A': ':', 24: '$', '2C': ',', '3B': ';', '3D': '=', '3F': '?', '2F': '/' };
function Um(e) {
  return encodeURIComponent(e).replace(rw, (n, t) => ow[t] ?? n);
}
function wa(e) {
  return `${e}`;
}
var qt = class e {
  map;
  encoder;
  updates = null;
  cloneFrom = null;
  constructor(n = {}) {
    if (((this.encoder = n.encoder || new Ta()), n.fromString)) {
      if (n.fromObject) throw new b(2805, !1);
      this.map = nw(n.fromString, this.encoder);
    } else
      n.fromObject
        ? ((this.map = new Map()),
          Object.keys(n.fromObject).forEach((t) => {
            let r = n.fromObject[t],
              o = Array.isArray(r) ? r.map(wa) : [wa(r)];
            this.map.set(t, o);
          }))
        : (this.map = null);
  }
  has(n) {
    return (this.init(), this.map.has(n));
  }
  get(n) {
    this.init();
    let t = this.map.get(n);
    return t ? t[0] : null;
  }
  getAll(n) {
    return (this.init(), this.map.get(n) || null);
  }
  keys() {
    return (this.init(), Array.from(this.map.keys()));
  }
  append(n, t) {
    return this.clone({ param: n, value: t, op: 'a' });
  }
  appendAll(n) {
    let t = [];
    return (
      Object.keys(n).forEach((r) => {
        let o = n[r];
        Array.isArray(o)
          ? o.forEach((i) => {
              t.push({ param: r, value: i, op: 'a' });
            })
          : t.push({ param: r, value: o, op: 'a' });
      }),
      this.clone(t)
    );
  }
  set(n, t) {
    return this.clone({ param: n, value: t, op: 's' });
  }
  delete(n, t) {
    return this.clone({ param: n, value: t, op: 'd' });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((n) => {
          let t = this.encoder.encodeKey(n);
          return this.map
            .get(n)
            .map((r) => t + '=' + this.encoder.encodeValue(r))
            .join('&');
        })
        .filter((n) => n !== '')
        .join('&')
    );
  }
  clone(n) {
    let t = new e({ encoder: this.encoder });
    return (
      (t.cloneFrom = this.cloneFrom || this),
      (t.updates = (this.updates || []).concat(n)),
      t
    );
  }
  init() {
    (this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom.keys().forEach((n) => this.map.set(n, this.cloneFrom.map.get(n))),
        this.updates.forEach((n) => {
          switch (n.op) {
            case 'a':
            case 's':
              let t = (n.op === 'a' ? this.map.get(n.param) : void 0) || [];
              (t.push(wa(n.value)), this.map.set(n.param, t));
              break;
            case 'd':
              if (n.value !== void 0) {
                let r = this.map.get(n.param) || [],
                  o = r.indexOf(wa(n.value));
                (o !== -1 && r.splice(o, 1),
                  r.length > 0 ? this.map.set(n.param, r) : this.map.delete(n.param));
              } else {
                this.map.delete(n.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null)));
  }
};
var Sa = class {
  map = new Map();
  set(n, t) {
    return (this.map.set(n, t), this);
  }
  get(n) {
    return (this.map.has(n) || this.map.set(n, n.defaultValue()), this.map.get(n));
  }
  delete(n) {
    return (this.map.delete(n), this);
  }
  has(n) {
    return this.map.has(n);
  }
  keys() {
    return this.map.keys();
  }
};
function iw(e) {
  switch (e) {
    case 'DELETE':
    case 'GET':
    case 'HEAD':
    case 'OPTIONS':
    case 'JSONP':
      return !1;
    default:
      return !0;
  }
}
function $m(e) {
  return typeof ArrayBuffer < 'u' && e instanceof ArrayBuffer;
}
function Hm(e) {
  return typeof Blob < 'u' && e instanceof Blob;
}
function zm(e) {
  return typeof FormData < 'u' && e instanceof FormData;
}
function sw(e) {
  return typeof URLSearchParams < 'u' && e instanceof URLSearchParams;
}
var ai = 'Content-Type',
  Ma = 'Accept',
  xd = 'X-Request-URL',
  qm = 'text/plain',
  Zm = 'application/json',
  Ym = `${Zm}, ${qm}, */*`,
  Lr = class e {
    url;
    body = null;
    headers;
    context;
    reportProgress = !1;
    withCredentials = !1;
    credentials;
    keepalive = !1;
    cache;
    priority;
    mode;
    redirect;
    referrer;
    integrity;
    responseType = 'json';
    method;
    params;
    urlWithParams;
    transferCache;
    timeout;
    constructor(n, t, r, o) {
      ((this.url = t), (this.method = n.toUpperCase()));
      let i;
      if ((iw(this.method) || o ? ((this.body = r !== void 0 ? r : null), (i = o)) : (i = r), i)) {
        if (
          ((this.reportProgress = !!i.reportProgress),
          (this.withCredentials = !!i.withCredentials),
          (this.keepalive = !!i.keepalive),
          i.responseType && (this.responseType = i.responseType),
          i.headers && (this.headers = i.headers),
          i.context && (this.context = i.context),
          i.params && (this.params = i.params),
          i.priority && (this.priority = i.priority),
          i.cache && (this.cache = i.cache),
          i.credentials && (this.credentials = i.credentials),
          typeof i.timeout == 'number')
        ) {
          if (i.timeout < 1 || !Number.isInteger(i.timeout)) throw new b(2822, '');
          this.timeout = i.timeout;
        }
        (i.mode && (this.mode = i.mode),
          i.redirect && (this.redirect = i.redirect),
          i.integrity && (this.integrity = i.integrity),
          i.referrer && (this.referrer = i.referrer),
          (this.transferCache = i.transferCache));
      }
      if (((this.headers ??= new St()), (this.context ??= new Sa()), !this.params))
        ((this.params = new qt()), (this.urlWithParams = t));
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = t;
        else {
          let a = t.indexOf('?'),
            c = a === -1 ? '?' : a < t.length - 1 ? '&' : '';
          this.urlWithParams = t + c + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == 'string' ||
            $m(this.body) ||
            Hm(this.body) ||
            zm(this.body) ||
            sw(this.body)
          ? this.body
          : this.body instanceof qt
            ? this.body.toString()
            : typeof this.body == 'object' ||
                typeof this.body == 'boolean' ||
                Array.isArray(this.body)
              ? JSON.stringify(this.body)
              : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || zm(this.body)
        ? null
        : Hm(this.body)
          ? this.body.type || null
          : $m(this.body)
            ? null
            : typeof this.body == 'string'
              ? qm
              : this.body instanceof qt
                ? 'application/x-www-form-urlencoded;charset=UTF-8'
                : typeof this.body == 'object' ||
                    typeof this.body == 'number' ||
                    typeof this.body == 'boolean'
                  ? Zm
                  : null;
    }
    clone(n = {}) {
      let t = n.method || this.method,
        r = n.url || this.url,
        o = n.responseType || this.responseType,
        i = n.keepalive ?? this.keepalive,
        s = n.priority || this.priority,
        a = n.cache || this.cache,
        c = n.mode || this.mode,
        l = n.redirect || this.redirect,
        u = n.credentials || this.credentials,
        d = n.referrer || this.referrer,
        p = n.integrity || this.integrity,
        f = n.transferCache ?? this.transferCache,
        m = n.timeout ?? this.timeout,
        _ = n.body !== void 0 ? n.body : this.body,
        I = n.withCredentials ?? this.withCredentials,
        D = n.reportProgress ?? this.reportProgress,
        z = n.headers || this.headers,
        De = n.params || this.params,
        ee = n.context ?? this.context;
      return (
        n.setHeaders !== void 0 &&
          (z = Object.keys(n.setHeaders).reduce((je, Nt) => je.set(Nt, n.setHeaders[Nt]), z)),
        n.setParams &&
          (De = Object.keys(n.setParams).reduce((je, Nt) => je.set(Nt, n.setParams[Nt]), De)),
        new e(t, r, _, {
          params: De,
          headers: z,
          context: ee,
          reportProgress: D,
          responseType: o,
          withCredentials: I,
          transferCache: f,
          keepalive: i,
          cache: a,
          priority: s,
          timeout: m,
          mode: c,
          redirect: l,
          credentials: u,
          referrer: d,
          integrity: p,
        })
      );
    }
  },
  Zt = (function (e) {
    return (
      (e[(e.Sent = 0)] = 'Sent'),
      (e[(e.UploadProgress = 1)] = 'UploadProgress'),
      (e[(e.ResponseHeader = 2)] = 'ResponseHeader'),
      (e[(e.DownloadProgress = 3)] = 'DownloadProgress'),
      (e[(e.Response = 4)] = 'Response'),
      (e[(e.User = 5)] = 'User'),
      e
    );
  })(Zt || {}),
  Br = class {
    headers;
    status;
    statusText;
    url;
    ok;
    type;
    redirected;
    constructor(n, t = 200, r = 'OK') {
      ((this.headers = n.headers || new St()),
        (this.status = n.status !== void 0 ? n.status : t),
        (this.statusText = n.statusText || r),
        (this.url = n.url || null),
        (this.redirected = n.redirected),
        (this.ok = this.status >= 200 && this.status < 300));
    }
  },
  ci = class e extends Br {
    constructor(n = {}) {
      super(n);
    }
    type = Zt.ResponseHeader;
    clone(n = {}) {
      return new e({
        headers: n.headers || this.headers,
        status: n.status !== void 0 ? n.status : this.status,
        statusText: n.statusText || this.statusText,
        url: n.url || this.url || void 0,
      });
    }
  },
  Vr = class e extends Br {
    body;
    constructor(n = {}) {
      (super(n), (this.body = n.body !== void 0 ? n.body : null));
    }
    type = Zt.Response;
    clone(n = {}) {
      return new e({
        body: n.body !== void 0 ? n.body : this.body,
        headers: n.headers || this.headers,
        status: n.status !== void 0 ? n.status : this.status,
        statusText: n.statusText || this.statusText,
        url: n.url || this.url || void 0,
        redirected: n.redirected ?? this.redirected,
      });
    }
  },
  Tt = class extends Br {
    name = 'HttpErrorResponse';
    message;
    error;
    ok = !1;
    constructor(n) {
      (super(n, 0, 'Unknown Error'),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${n.url || '(unknown url)'}`)
          : (this.message = `Http failure response for ${n.url || '(unknown url)'}: ${n.status} ${n.statusText}`),
        (this.error = n.error || null));
    }
  },
  Qm = 200,
  aw = 204;
function Td(e, n) {
  return {
    body: n,
    headers: e.headers,
    context: e.context,
    observe: e.observe,
    params: e.params,
    reportProgress: e.reportProgress,
    responseType: e.responseType,
    withCredentials: e.withCredentials,
    credentials: e.credentials,
    transferCache: e.transferCache,
    timeout: e.timeout,
    keepalive: e.keepalive,
    priority: e.priority,
    cache: e.cache,
    mode: e.mode,
    redirect: e.redirect,
    integrity: e.integrity,
    referrer: e.referrer,
  };
}
var Ur = (() => {
    class e {
      handler;
      constructor(t) {
        this.handler = t;
      }
      request(t, r, o = {}) {
        let i;
        if (t instanceof Lr) i = t;
        else {
          let c;
          o.headers instanceof St ? (c = o.headers) : (c = new St(o.headers));
          let l;
          (o.params &&
            (o.params instanceof qt ? (l = o.params) : (l = new qt({ fromObject: o.params }))),
            (i = new Lr(t, r, o.body !== void 0 ? o.body : null, {
              headers: c,
              context: o.context,
              params: l,
              reportProgress: o.reportProgress,
              responseType: o.responseType || 'json',
              withCredentials: o.withCredentials,
              transferCache: o.transferCache,
              keepalive: o.keepalive,
              priority: o.priority,
              cache: o.cache,
              mode: o.mode,
              redirect: o.redirect,
              credentials: o.credentials,
              referrer: o.referrer,
              integrity: o.integrity,
              timeout: o.timeout,
            })));
        }
        let s = S(i).pipe(ft((c) => this.handler.handle(c)));
        if (t instanceof Lr || o.observe === 'events') return s;
        let a = s.pipe(Oe((c) => c instanceof Vr));
        switch (o.observe || 'body') {
          case 'body':
            switch (i.responseType) {
              case 'arraybuffer':
                return a.pipe(
                  A((c) => {
                    if (c.body !== null && !(c.body instanceof ArrayBuffer)) throw new b(2806, !1);
                    return c.body;
                  }),
                );
              case 'blob':
                return a.pipe(
                  A((c) => {
                    if (c.body !== null && !(c.body instanceof Blob)) throw new b(2807, !1);
                    return c.body;
                  }),
                );
              case 'text':
                return a.pipe(
                  A((c) => {
                    if (c.body !== null && typeof c.body != 'string') throw new b(2808, !1);
                    return c.body;
                  }),
                );
              case 'json':
              default:
                return a.pipe(A((c) => c.body));
            }
          case 'response':
            return a;
          default:
            throw new b(2809, !1);
        }
      }
      delete(t, r = {}) {
        return this.request('DELETE', t, r);
      }
      get(t, r = {}) {
        return this.request('GET', t, r);
      }
      head(t, r = {}) {
        return this.request('HEAD', t, r);
      }
      jsonp(t, r) {
        return this.request('JSONP', t, {
          params: new qt().append(r, 'JSONP_CALLBACK'),
          observe: 'body',
          responseType: 'json',
        });
      }
      options(t, r = {}) {
        return this.request('OPTIONS', t, r);
      }
      patch(t, r, o = {}) {
        return this.request('PATCH', t, Td(o, r));
      }
      post(t, r, o = {}) {
        return this.request('POST', t, Td(o, r));
      }
      put(t, r, o = {}) {
        return this.request('PUT', t, Td(o, r));
      }
      static ɵfac = function (r) {
        return new (r || e)(M(Fr));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  cw = /^\)\]\}',?\n/;
function Gm(e) {
  if (e.url) return e.url;
  let n = xd.toLocaleLowerCase();
  return e.headers.get(n);
}
var Km = new T(''),
  _a = (() => {
    class e {
      fetchImpl = h(Sd, { optional: !0 })?.fetch ?? ((...t) => globalThis.fetch(...t));
      ngZone = h(ae);
      destroyRef = h(hn);
      destroyed = !1;
      constructor() {
        this.destroyRef.onDestroy(() => {
          this.destroyed = !0;
        });
      }
      handle(t) {
        return new F((r) => {
          let o = new AbortController();
          this.doRequest(t, o.signal, r).then(Md, (s) => r.error(new Tt({ error: s })));
          let i;
          return (
            t.timeout &&
              (i = this.ngZone.runOutsideAngular(() =>
                setTimeout(() => {
                  o.signal.aborted || o.abort(new DOMException('signal timed out', 'TimeoutError'));
                }, t.timeout),
              )),
            () => {
              (i !== void 0 && clearTimeout(i), o.abort());
            }
          );
        });
      }
      doRequest(t, r, o) {
        return wn(this, null, function* () {
          let i = this.createRequestInit(t),
            s;
          try {
            let m = this.ngZone.runOutsideAngular(() =>
              this.fetchImpl(t.urlWithParams, C({ signal: r }, i)),
            );
            (lw(m), o.next({ type: Zt.Sent }), (s = yield m));
          } catch (m) {
            o.error(
              new Tt({
                error: m,
                status: m.status ?? 0,
                statusText: m.statusText,
                url: t.urlWithParams,
                headers: m.headers,
              }),
            );
            return;
          }
          let a = new St(s.headers),
            c = s.statusText,
            l = Gm(s) ?? t.urlWithParams,
            u = s.status,
            d = null;
          if (
            (t.reportProgress && o.next(new ci({ headers: a, status: u, statusText: c, url: l })),
            s.body)
          ) {
            let m = s.headers.get('content-length'),
              _ = [],
              I = s.body.getReader(),
              D = 0,
              z,
              De,
              ee = typeof Zone < 'u' && Zone.current,
              je = !1;
            if (
              (yield this.ngZone.runOutsideAngular(() =>
                wn(this, null, function* () {
                  for (;;) {
                    if (this.destroyed) {
                      (yield I.cancel(), (je = !0));
                      break;
                    }
                    let { done: In, value: lc } = yield I.read();
                    if (In) break;
                    if ((_.push(lc), (D += lc.length), t.reportProgress)) {
                      De =
                        t.responseType === 'text'
                          ? (De ?? '') + (z ??= new TextDecoder()).decode(lc, { stream: !0 })
                          : void 0;
                      let bf = () =>
                        o.next({
                          type: Zt.DownloadProgress,
                          total: m ? +m : void 0,
                          loaded: D,
                          partialText: De,
                        });
                      ee ? ee.run(bf) : bf();
                    }
                  }
                }),
              ),
              je)
            ) {
              o.complete();
              return;
            }
            let Nt = this.concatChunks(_, D);
            try {
              let In = s.headers.get(ai) ?? '';
              d = this.parseBody(t, Nt, In, u);
            } catch (In) {
              o.error(
                new Tt({
                  error: In,
                  headers: new St(s.headers),
                  status: s.status,
                  statusText: s.statusText,
                  url: Gm(s) ?? t.urlWithParams,
                }),
              );
              return;
            }
          }
          u === 0 && (u = d ? Qm : 0);
          let p = u >= 200 && u < 300,
            f = s.redirected;
          p
            ? (o.next(
                new Vr({ body: d, headers: a, status: u, statusText: c, url: l, redirected: f }),
              ),
              o.complete())
            : o.error(
                new Tt({ error: d, headers: a, status: u, statusText: c, url: l, redirected: f }),
              );
        });
      }
      parseBody(t, r, o, i) {
        switch (t.responseType) {
          case 'json':
            let s = new TextDecoder().decode(r).replace(cw, '');
            if (s === '') return null;
            try {
              return JSON.parse(s);
            } catch (a) {
              if (i < 200 || i >= 300) return s;
              throw a;
            }
          case 'text':
            return new TextDecoder().decode(r);
          case 'blob':
            return new Blob([r], { type: o });
          case 'arraybuffer':
            return r.buffer;
        }
      }
      createRequestInit(t) {
        let r = {},
          o;
        if (
          ((o = t.credentials),
          t.withCredentials && (o = 'include'),
          t.headers.forEach((i, s) => (r[i] = s.join(','))),
          t.headers.has(Ma) || (r[Ma] = Ym),
          !t.headers.has(ai))
        ) {
          let i = t.detectContentTypeHeader();
          i !== null && (r[ai] = i);
        }
        return {
          body: t.serializeBody(),
          method: t.method,
          headers: r,
          credentials: o,
          keepalive: t.keepalive,
          cache: t.cache,
          priority: t.priority,
          mode: t.mode,
          redirect: t.redirect,
          referrer: t.referrer,
          integrity: t.integrity,
        };
      }
      concatChunks(t, r) {
        let o = new Uint8Array(r),
          i = 0;
        for (let s of t) (o.set(s, i), (i += s.length));
        return o;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Sd = class {};
function Md() {}
function lw(e) {
  e.then(Md, Md);
}
function Jm(e, n) {
  return n(e);
}
function uw(e, n) {
  return (t, r) => n.intercept(t, { handle: (o) => e(o, r) });
}
function dw(e, n, t) {
  return (r, o) => Ie(t, () => n(r, (i) => e(i, o)));
}
var Xm = new T(''),
  Rd = new T(''),
  ev = new T(''),
  Ad = new T('', { providedIn: 'root', factory: () => !0 });
function fw() {
  let e = null;
  return (n, t) => {
    e === null && (e = (h(Xm, { optional: !0 }) ?? []).reduceRight(uw, Jm));
    let r = h(Ao);
    if (h(Ad)) {
      let i = r.add();
      return e(n, t).pipe(on(i));
    } else return e(n, t);
  };
}
var Na = (() => {
  class e extends Fr {
    backend;
    injector;
    chain = null;
    pendingTasks = h(Ao);
    contributeToStability = h(Ad);
    constructor(t, r) {
      (super(), (this.backend = t), (this.injector = r));
    }
    handle(t) {
      if (this.chain === null) {
        let r = Array.from(new Set([...this.injector.get(Rd), ...this.injector.get(ev, [])]));
        this.chain = r.reduceRight((o, i) => dw(o, i, this.injector), Jm);
      }
      if (this.contributeToStability) {
        let r = this.pendingTasks.add();
        return this.chain(t, (o) => this.backend.handle(o)).pipe(on(r));
      } else return this.chain(t, (r) => this.backend.handle(r));
    }
    static ɵfac = function (r) {
      return new (r || e)(M(jr), M(me));
    };
    static ɵprov = w({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var pw = /^\)\]\}',?\n/,
  hw = RegExp(`^${xd}:`, 'm');
function gw(e) {
  return 'responseURL' in e && e.responseURL
    ? e.responseURL
    : hw.test(e.getAllResponseHeaders())
      ? e.getResponseHeader(xd)
      : null;
}
var Nd = (() => {
    class e {
      xhrFactory;
      constructor(t) {
        this.xhrFactory = t;
      }
      handle(t) {
        if (t.method === 'JSONP') throw new b(-2800, !1);
        let r = this.xhrFactory;
        return S(null).pipe(
          ge(
            () =>
              new F((i) => {
                let s = r.build();
                if (
                  (s.open(t.method, t.urlWithParams),
                  t.withCredentials && (s.withCredentials = !0),
                  t.headers.forEach((I, D) => s.setRequestHeader(I, D.join(','))),
                  t.headers.has(Ma) || s.setRequestHeader(Ma, Ym),
                  !t.headers.has(ai))
                ) {
                  let I = t.detectContentTypeHeader();
                  I !== null && s.setRequestHeader(ai, I);
                }
                if ((t.timeout && (s.timeout = t.timeout), t.responseType)) {
                  let I = t.responseType.toLowerCase();
                  s.responseType = I !== 'json' ? I : 'text';
                }
                let a = t.serializeBody(),
                  c = null,
                  l = () => {
                    if (c !== null) return c;
                    let I = s.statusText || 'OK',
                      D = new St(s.getAllResponseHeaders()),
                      z = gw(s) || t.url;
                    return (
                      (c = new ci({ headers: D, status: s.status, statusText: I, url: z })),
                      c
                    );
                  },
                  u = () => {
                    let { headers: I, status: D, statusText: z, url: De } = l(),
                      ee = null;
                    (D !== aw && (ee = typeof s.response > 'u' ? s.responseText : s.response),
                      D === 0 && (D = ee ? Qm : 0));
                    let je = D >= 200 && D < 300;
                    if (t.responseType === 'json' && typeof ee == 'string') {
                      let Nt = ee;
                      ee = ee.replace(pw, '');
                      try {
                        ee = ee !== '' ? JSON.parse(ee) : null;
                      } catch (In) {
                        ((ee = Nt), je && ((je = !1), (ee = { error: In, text: ee })));
                      }
                    }
                    je
                      ? (i.next(
                          new Vr({
                            body: ee,
                            headers: I,
                            status: D,
                            statusText: z,
                            url: De || void 0,
                          }),
                        ),
                        i.complete())
                      : i.error(
                          new Tt({
                            error: ee,
                            headers: I,
                            status: D,
                            statusText: z,
                            url: De || void 0,
                          }),
                        );
                  },
                  d = (I) => {
                    let { url: D } = l(),
                      z = new Tt({
                        error: I,
                        status: s.status || 0,
                        statusText: s.statusText || 'Unknown Error',
                        url: D || void 0,
                      });
                    i.error(z);
                  },
                  p = d;
                t.timeout &&
                  (p = (I) => {
                    let { url: D } = l(),
                      z = new Tt({
                        error: new DOMException('Request timed out', 'TimeoutError'),
                        status: s.status || 0,
                        statusText: s.statusText || 'Request timeout',
                        url: D || void 0,
                      });
                    i.error(z);
                  });
                let f = !1,
                  m = (I) => {
                    f || (i.next(l()), (f = !0));
                    let D = { type: Zt.DownloadProgress, loaded: I.loaded };
                    (I.lengthComputable && (D.total = I.total),
                      t.responseType === 'text' &&
                        s.responseText &&
                        (D.partialText = s.responseText),
                      i.next(D));
                  },
                  _ = (I) => {
                    let D = { type: Zt.UploadProgress, loaded: I.loaded };
                    (I.lengthComputable && (D.total = I.total), i.next(D));
                  };
                return (
                  s.addEventListener('load', u),
                  s.addEventListener('error', d),
                  s.addEventListener('timeout', p),
                  s.addEventListener('abort', d),
                  t.reportProgress &&
                    (s.addEventListener('progress', m),
                    a !== null && s.upload && s.upload.addEventListener('progress', _)),
                  s.send(a),
                  i.next({ type: Zt.Sent }),
                  () => {
                    (s.removeEventListener('error', d),
                      s.removeEventListener('abort', d),
                      s.removeEventListener('load', u),
                      s.removeEventListener('timeout', p),
                      t.reportProgress &&
                        (s.removeEventListener('progress', m),
                        a !== null && s.upload && s.upload.removeEventListener('progress', _)),
                      s.readyState !== s.DONE && s.abort());
                  }
                );
              }),
          ),
        );
      }
      static ɵfac = function (r) {
        return new (r || e)(M(Kn));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  tv = new T(''),
  mw = 'XSRF-TOKEN',
  vw = new T('', { providedIn: 'root', factory: () => mw }),
  yw = 'X-XSRF-TOKEN',
  Ew = new T('', { providedIn: 'root', factory: () => yw }),
  li = class {},
  Dw = (() => {
    class e {
      doc;
      cookieName;
      lastCookieString = '';
      lastToken = null;
      parseCount = 0;
      constructor(t, r) {
        ((this.doc = t), (this.cookieName = r));
      }
      getToken() {
        let t = this.doc.cookie || '';
        return (
          t !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = ni(t, this.cookieName)),
            (this.lastCookieString = t)),
          this.lastToken
        );
      }
      static ɵfac = function (r) {
        return new (r || e)(M(fe), M(vw));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })();
function Cw(e, n) {
  let t = e.url.toLowerCase();
  if (
    !h(tv) ||
    e.method === 'GET' ||
    e.method === 'HEAD' ||
    t.startsWith('http://') ||
    t.startsWith('https://')
  )
    return n(e);
  let r = h(li).getToken(),
    o = h(Ew);
  return (r != null && !e.headers.has(o) && (e = e.clone({ headers: e.headers.set(o, r) })), n(e));
}
var xa = (function (e) {
  return (
    (e[(e.Interceptors = 0)] = 'Interceptors'),
    (e[(e.LegacyInterceptors = 1)] = 'LegacyInterceptors'),
    (e[(e.CustomXsrfConfiguration = 2)] = 'CustomXsrfConfiguration'),
    (e[(e.NoXsrfProtection = 3)] = 'NoXsrfProtection'),
    (e[(e.JsonpSupport = 4)] = 'JsonpSupport'),
    (e[(e.RequestsMadeViaParent = 5)] = 'RequestsMadeViaParent'),
    (e[(e.Fetch = 6)] = 'Fetch'),
    e
  );
})(xa || {});
function nv(e, n) {
  return { ɵkind: e, ɵproviders: n };
}
function Ra(...e) {
  let n = [
    Ur,
    Nd,
    Na,
    { provide: Fr, useExisting: Na },
    { provide: jr, useFactory: () => h(Km, { optional: !0 }) ?? h(Nd) },
    { provide: Rd, useValue: Cw, multi: !0 },
    { provide: tv, useValue: !0 },
    { provide: li, useClass: Dw },
  ];
  for (let t of e) n.push(...t.ɵproviders);
  return On(n);
}
var Wm = new T('');
function rv() {
  return nv(xa.LegacyInterceptors, [
    { provide: Wm, useFactory: fw },
    { provide: Rd, useExisting: Wm, multi: !0 },
  ]);
}
function Od() {
  return nv(xa.Fetch, [_a, { provide: Km, useExisting: _a }, { provide: jr, useExisting: _a }]);
}
var kd = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = Ut({ type: e });
    static ɵinj = ht({ providers: [Ra(rv())] });
  }
  return e;
})();
var ov = (() => {
  class e {
    _doc;
    constructor(t) {
      this._doc = t;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(t) {
      this._doc.title = t || '';
    }
    static ɵfac = function (r) {
      return new (r || e)(M(fe));
    };
    static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
var Pd = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({
        token: e,
        factory: function (r) {
          let o = null;
          return (r ? (o = new (r || e)()) : (o = M(Iw)), o);
        },
        providedIn: 'root',
      });
    }
    return e;
  })(),
  Iw = (() => {
    class e extends Pd {
      _doc;
      constructor(t) {
        (super(), (this._doc = t));
      }
      sanitize(t, r) {
        if (r == null) return null;
        switch (t) {
          case at.NONE:
            return r;
          case at.HTML:
            return Bt(r, 'HTML') ? bt(r) : ra(this._doc, String(r)).toString();
          case at.STYLE:
            return Bt(r, 'Style') ? bt(r) : r;
          case at.SCRIPT:
            if (Bt(r, 'Script')) return bt(r);
            throw new b(5200, !1);
          case at.URL:
            return Bt(r, 'URL') ? bt(r) : zo(String(r));
          case at.RESOURCE_URL:
            if (Bt(r, 'ResourceURL')) return bt(r);
            throw new b(5201, !1);
          default:
            throw new b(5202, !1);
        }
      }
      bypassSecurityTrustHtml(t) {
        return Tu(t);
      }
      bypassSecurityTrustStyle(t) {
        return Su(t);
      }
      bypassSecurityTrustScript(t) {
        return Mu(t);
      }
      bypassSecurityTrustUrl(t) {
        return Nu(t);
      }
      bypassSecurityTrustResourceUrl(t) {
        return xu(t);
      }
      static ɵfac = function (r) {
        return new (r || e)(M(fe));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
var L = 'primary',
  bi = Symbol('RouteTitle'),
  Vd = class {
    params;
    constructor(n) {
      this.params = n || {};
    }
    has(n) {
      return Object.prototype.hasOwnProperty.call(this.params, n);
    }
    get(n) {
      if (this.has(n)) {
        let t = this.params[n];
        return Array.isArray(t) ? t[0] : t;
      }
      return null;
    }
    getAll(n) {
      if (this.has(n)) {
        let t = this.params[n];
        return Array.isArray(t) ? t : [t];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function qr(e) {
  return new Vd(e);
}
function ww(e, n, t) {
  let r = t.path.split('/');
  if (r.length > e.length || (t.pathMatch === 'full' && (n.hasChildren() || r.length < e.length)))
    return null;
  let o = {};
  for (let i = 0; i < r.length; i++) {
    let s = r[i],
      a = e[i];
    if (s[0] === ':') o[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: e.slice(0, r.length), posParams: o };
}
function _w(e, n) {
  if (e.length !== n.length) return !1;
  for (let t = 0; t < e.length; ++t) if (!Mt(e[t], n[t])) return !1;
  return !0;
}
function Mt(e, n) {
  let t = e ? Ud(e) : void 0,
    r = n ? Ud(n) : void 0;
  if (!t || !r || t.length != r.length) return !1;
  let o;
  for (let i = 0; i < t.length; i++) if (((o = t[i]), !pv(e[o], n[o]))) return !1;
  return !0;
}
function Ud(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function pv(e, n) {
  if (Array.isArray(e) && Array.isArray(n)) {
    if (e.length !== n.length) return !1;
    let t = [...e].sort(),
      r = [...n].sort();
    return t.every((o, i) => r[i] === o);
  } else return e === n;
}
function hv(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function Kt(e) {
  return dt(e) ? e : Rr(e) ? ue(Promise.resolve(e)) : S(e);
}
var Tw = { exact: mv, subset: vv },
  gv = { exact: Sw, subset: Mw, ignored: () => !0 };
function sv(e, n, t) {
  return (
    Tw[t.paths](e.root, n.root, t.matrixParams) &&
    gv[t.queryParams](e.queryParams, n.queryParams) &&
    !(t.fragment === 'exact' && e.fragment !== n.fragment)
  );
}
function Sw(e, n) {
  return Mt(e, n);
}
function mv(e, n, t) {
  if (
    !Xn(e.segments, n.segments) ||
    !ka(e.segments, n.segments, t) ||
    e.numberOfChildren !== n.numberOfChildren
  )
    return !1;
  for (let r in n.children) if (!e.children[r] || !mv(e.children[r], n.children[r], t)) return !1;
  return !0;
}
function Mw(e, n) {
  return (
    Object.keys(n).length <= Object.keys(e).length && Object.keys(n).every((t) => pv(e[t], n[t]))
  );
}
function vv(e, n, t) {
  return yv(e, n, n.segments, t);
}
function yv(e, n, t, r) {
  if (e.segments.length > t.length) {
    let o = e.segments.slice(0, t.length);
    return !(!Xn(o, t) || n.hasChildren() || !ka(o, t, r));
  } else if (e.segments.length === t.length) {
    if (!Xn(e.segments, t) || !ka(e.segments, t, r)) return !1;
    for (let o in n.children) if (!e.children[o] || !vv(e.children[o], n.children[o], r)) return !1;
    return !0;
  } else {
    let o = t.slice(0, e.segments.length),
      i = t.slice(e.segments.length);
    return !Xn(e.segments, o) || !ka(e.segments, o, r) || !e.children[L]
      ? !1
      : yv(e.children[L], n, i, r);
  }
}
function ka(e, n, t) {
  return n.every((r, o) => gv[t](e[o].parameters, r.parameters));
}
var Qt = class {
    root;
    queryParams;
    fragment;
    _queryParamMap;
    constructor(n = new q([], {}), t = {}, r = null) {
      ((this.root = n), (this.queryParams = t), (this.fragment = r));
    }
    get queryParamMap() {
      return ((this._queryParamMap ??= qr(this.queryParams)), this._queryParamMap);
    }
    toString() {
      return Rw.serialize(this);
    }
  },
  q = class {
    segments;
    children;
    parent = null;
    constructor(n, t) {
      ((this.segments = n),
        (this.children = t),
        Object.values(t).forEach((r) => (r.parent = this)));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return Pa(this);
    }
  },
  Jn = class {
    path;
    parameters;
    _parameterMap;
    constructor(n, t) {
      ((this.path = n), (this.parameters = t));
    }
    get parameterMap() {
      return ((this._parameterMap ??= qr(this.parameters)), this._parameterMap);
    }
    toString() {
      return Dv(this);
    }
  };
function Nw(e, n) {
  return Xn(e, n) && e.every((t, r) => Mt(t.parameters, n[r].parameters));
}
function Xn(e, n) {
  return e.length !== n.length ? !1 : e.every((t, r) => t.path === n[r].path);
}
function xw(e, n) {
  let t = [];
  return (
    Object.entries(e.children).forEach(([r, o]) => {
      r === L && (t = t.concat(n(o, r)));
    }),
    Object.entries(e.children).forEach(([r, o]) => {
      r !== L && (t = t.concat(n(o, r)));
    }),
    t
  );
}
var qa = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: () => new Zr(), providedIn: 'root' });
    }
    return e;
  })(),
  Zr = class {
    parse(n) {
      let t = new Hd(n);
      return new Qt(t.parseRootSegment(), t.parseQueryParams(), t.parseFragment());
    }
    serialize(n) {
      let t = `/${ui(n.root, !0)}`,
        r = kw(n.queryParams),
        o = typeof n.fragment == 'string' ? `#${Aw(n.fragment)}` : '';
      return `${t}${r}${o}`;
    }
  },
  Rw = new Zr();
function Pa(e) {
  return e.segments.map((n) => Dv(n)).join('/');
}
function ui(e, n) {
  if (!e.hasChildren()) return Pa(e);
  if (n) {
    let t = e.children[L] ? ui(e.children[L], !1) : '',
      r = [];
    return (
      Object.entries(e.children).forEach(([o, i]) => {
        o !== L && r.push(`${o}:${ui(i, !1)}`);
      }),
      r.length > 0 ? `${t}(${r.join('//')})` : t
    );
  } else {
    let t = xw(e, (r, o) => (o === L ? [ui(e.children[L], !1)] : [`${o}:${ui(r, !1)}`]));
    return Object.keys(e.children).length === 1 && e.children[L] != null
      ? `${Pa(e)}/${t[0]}`
      : `${Pa(e)}/(${t.join('//')})`;
  }
}
function Ev(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',');
}
function Aa(e) {
  return Ev(e).replace(/%3B/gi, ';');
}
function Aw(e) {
  return encodeURI(e);
}
function $d(e) {
  return Ev(e).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
}
function La(e) {
  return decodeURIComponent(e);
}
function av(e) {
  return La(e.replace(/\+/g, '%20'));
}
function Dv(e) {
  return `${$d(e.path)}${Ow(e.parameters)}`;
}
function Ow(e) {
  return Object.entries(e)
    .map(([n, t]) => `;${$d(n)}=${$d(t)}`)
    .join('');
}
function kw(e) {
  let n = Object.entries(e)
    .map(([t, r]) =>
      Array.isArray(r) ? r.map((o) => `${Aa(t)}=${Aa(o)}`).join('&') : `${Aa(t)}=${Aa(r)}`,
    )
    .filter((t) => t);
  return n.length ? `?${n.join('&')}` : '';
}
var Pw = /^[^\/()?;#]+/;
function Ld(e) {
  let n = e.match(Pw);
  return n ? n[0] : '';
}
var Lw = /^[^\/()?;=#]+/;
function Fw(e) {
  let n = e.match(Lw);
  return n ? n[0] : '';
}
var jw = /^[^=?&#]+/;
function Bw(e) {
  let n = e.match(jw);
  return n ? n[0] : '';
}
var Vw = /^[^&#]+/;
function Uw(e) {
  let n = e.match(Vw);
  return n ? n[0] : '';
}
var Hd = class {
  url;
  remaining;
  constructor(n) {
    ((this.url = n), (this.remaining = n));
  }
  parseRootSegment() {
    return (
      this.consumeOptional('/'),
      this.remaining === '' || this.peekStartsWith('?') || this.peekStartsWith('#')
        ? new q([], {})
        : new q([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let n = {};
    if (this.consumeOptional('?'))
      do this.parseQueryParam(n);
      while (this.consumeOptional('&'));
    return n;
  }
  parseFragment() {
    return this.consumeOptional('#') ? decodeURIComponent(this.remaining) : null;
  }
  parseChildren() {
    if (this.remaining === '') return {};
    this.consumeOptional('/');
    let n = [];
    for (
      this.peekStartsWith('(') || n.push(this.parseSegment());
      this.peekStartsWith('/') && !this.peekStartsWith('//') && !this.peekStartsWith('/(');

    )
      (this.capture('/'), n.push(this.parseSegment()));
    let t = {};
    this.peekStartsWith('/(') && (this.capture('/'), (t = this.parseParens(!0)));
    let r = {};
    return (
      this.peekStartsWith('(') && (r = this.parseParens(!1)),
      (n.length > 0 || Object.keys(t).length > 0) && (r[L] = new q(n, t)),
      r
    );
  }
  parseSegment() {
    let n = Ld(this.remaining);
    if (n === '' && this.peekStartsWith(';')) throw new b(4009, !1);
    return (this.capture(n), new Jn(La(n), this.parseMatrixParams()));
  }
  parseMatrixParams() {
    let n = {};
    for (; this.consumeOptional(';'); ) this.parseParam(n);
    return n;
  }
  parseParam(n) {
    let t = Fw(this.remaining);
    if (!t) return;
    this.capture(t);
    let r = '';
    if (this.consumeOptional('=')) {
      let o = Ld(this.remaining);
      o && ((r = o), this.capture(r));
    }
    n[La(t)] = La(r);
  }
  parseQueryParam(n) {
    let t = Bw(this.remaining);
    if (!t) return;
    this.capture(t);
    let r = '';
    if (this.consumeOptional('=')) {
      let s = Uw(this.remaining);
      s && ((r = s), this.capture(r));
    }
    let o = av(t),
      i = av(r);
    if (n.hasOwnProperty(o)) {
      let s = n[o];
      (Array.isArray(s) || ((s = [s]), (n[o] = s)), s.push(i));
    } else n[o] = i;
  }
  parseParens(n) {
    let t = {};
    for (this.capture('('); !this.consumeOptional(')') && this.remaining.length > 0; ) {
      let r = Ld(this.remaining),
        o = this.remaining[r.length];
      if (o !== '/' && o !== ')' && o !== ';') throw new b(4010, !1);
      let i;
      r.indexOf(':') > -1
        ? ((i = r.slice(0, r.indexOf(':'))), this.capture(i), this.capture(':'))
        : n && (i = L);
      let s = this.parseChildren();
      ((t[i] = Object.keys(s).length === 1 ? s[L] : new q([], s)), this.consumeOptional('//'));
    }
    return t;
  }
  peekStartsWith(n) {
    return this.remaining.startsWith(n);
  }
  consumeOptional(n) {
    return this.peekStartsWith(n)
      ? ((this.remaining = this.remaining.substring(n.length)), !0)
      : !1;
  }
  capture(n) {
    if (!this.consumeOptional(n)) throw new b(4011, !1);
  }
};
function Cv(e) {
  return e.segments.length > 0 ? new q([], { [L]: e }) : e;
}
function bv(e) {
  let n = {};
  for (let [r, o] of Object.entries(e.children)) {
    let i = bv(o);
    if (r === L && i.segments.length === 0 && i.hasChildren())
      for (let [s, a] of Object.entries(i.children)) n[s] = a;
    else (i.segments.length > 0 || i.hasChildren()) && (n[r] = i);
  }
  let t = new q(e.segments, n);
  return $w(t);
}
function $w(e) {
  if (e.numberOfChildren === 1 && e.children[L]) {
    let n = e.children[L];
    return new q(e.segments.concat(n.segments), n.children);
  }
  return e;
}
function Yr(e) {
  return e instanceof Qt;
}
function Hw(e, n, t = null, r = null) {
  let o = Iv(e);
  return wv(o, n, t, r);
}
function Iv(e) {
  let n;
  function t(i) {
    let s = {};
    for (let c of i.children) {
      let l = t(c);
      s[c.outlet] = l;
    }
    let a = new q(i.url, s);
    return (i === e && (n = a), a);
  }
  let r = t(e.root),
    o = Cv(r);
  return n ?? o;
}
function wv(e, n, t, r) {
  let o = e;
  for (; o.parent; ) o = o.parent;
  if (n.length === 0) return Fd(o, o, o, t, r);
  let i = zw(n);
  if (i.toRoot()) return Fd(o, o, new q([], {}), t, r);
  let s = Gw(i, o, e),
    a = s.processChildren
      ? fi(s.segmentGroup, s.index, i.commands)
      : Tv(s.segmentGroup, s.index, i.commands);
  return Fd(o, s.segmentGroup, a, t, r);
}
function Fa(e) {
  return typeof e == 'object' && e != null && !e.outlets && !e.segmentPath;
}
function gi(e) {
  return typeof e == 'object' && e != null && e.outlets;
}
function Fd(e, n, t, r, o) {
  let i = {};
  r &&
    Object.entries(r).forEach(([c, l]) => {
      i[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
    });
  let s;
  e === n ? (s = t) : (s = _v(e, n, t));
  let a = Cv(bv(s));
  return new Qt(a, i, o);
}
function _v(e, n, t) {
  let r = {};
  return (
    Object.entries(e.children).forEach(([o, i]) => {
      i === n ? (r[o] = t) : (r[o] = _v(i, n, t));
    }),
    new q(e.segments, r)
  );
}
var ja = class {
  isAbsolute;
  numberOfDoubleDots;
  commands;
  constructor(n, t, r) {
    if (
      ((this.isAbsolute = n),
      (this.numberOfDoubleDots = t),
      (this.commands = r),
      n && r.length > 0 && Fa(r[0]))
    )
      throw new b(4003, !1);
    let o = r.find(gi);
    if (o && o !== hv(r)) throw new b(4004, !1);
  }
  toRoot() {
    return this.isAbsolute && this.commands.length === 1 && this.commands[0] == '/';
  }
};
function zw(e) {
  if (typeof e[0] == 'string' && e.length === 1 && e[0] === '/') return new ja(!0, 0, e);
  let n = 0,
    t = !1,
    r = e.reduce((o, i, s) => {
      if (typeof i == 'object' && i != null) {
        if (i.outlets) {
          let a = {};
          return (
            Object.entries(i.outlets).forEach(([c, l]) => {
              a[c] = typeof l == 'string' ? l.split('/') : l;
            }),
            [...o, { outlets: a }]
          );
        }
        if (i.segmentPath) return [...o, i.segmentPath];
      }
      return typeof i != 'string'
        ? [...o, i]
        : s === 0
          ? (i.split('/').forEach((a, c) => {
              (c == 0 && a === '.') ||
                (c == 0 && a === '' ? (t = !0) : a === '..' ? n++ : a != '' && o.push(a));
            }),
            o)
          : [...o, i];
    }, []);
  return new ja(t, n, r);
}
var zr = class {
  segmentGroup;
  processChildren;
  index;
  constructor(n, t, r) {
    ((this.segmentGroup = n), (this.processChildren = t), (this.index = r));
  }
};
function Gw(e, n, t) {
  if (e.isAbsolute) return new zr(n, !0, 0);
  if (!t) return new zr(n, !1, NaN);
  if (t.parent === null) return new zr(t, !0, 0);
  let r = Fa(e.commands[0]) ? 0 : 1,
    o = t.segments.length - 1 + r;
  return Ww(t, o, e.numberOfDoubleDots);
}
function Ww(e, n, t) {
  let r = e,
    o = n,
    i = t;
  for (; i > o; ) {
    if (((i -= o), (r = r.parent), !r)) throw new b(4005, !1);
    o = r.segments.length;
  }
  return new zr(r, !1, o - i);
}
function qw(e) {
  return gi(e[0]) ? e[0].outlets : { [L]: e };
}
function Tv(e, n, t) {
  if (((e ??= new q([], {})), e.segments.length === 0 && e.hasChildren())) return fi(e, n, t);
  let r = Zw(e, n, t),
    o = t.slice(r.commandIndex);
  if (r.match && r.pathIndex < e.segments.length) {
    let i = new q(e.segments.slice(0, r.pathIndex), {});
    return ((i.children[L] = new q(e.segments.slice(r.pathIndex), e.children)), fi(i, 0, o));
  } else
    return r.match && o.length === 0
      ? new q(e.segments, {})
      : r.match && !e.hasChildren()
        ? zd(e, n, t)
        : r.match
          ? fi(e, 0, o)
          : zd(e, n, t);
}
function fi(e, n, t) {
  if (t.length === 0) return new q(e.segments, {});
  {
    let r = qw(t),
      o = {};
    if (
      Object.keys(r).some((i) => i !== L) &&
      e.children[L] &&
      e.numberOfChildren === 1 &&
      e.children[L].segments.length === 0
    ) {
      let i = fi(e.children[L], n, t);
      return new q(e.segments, i.children);
    }
    return (
      Object.entries(r).forEach(([i, s]) => {
        (typeof s == 'string' && (s = [s]), s !== null && (o[i] = Tv(e.children[i], n, s)));
      }),
      Object.entries(e.children).forEach(([i, s]) => {
        r[i] === void 0 && (o[i] = s);
      }),
      new q(e.segments, o)
    );
  }
}
function Zw(e, n, t) {
  let r = 0,
    o = n,
    i = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; o < e.segments.length; ) {
    if (r >= t.length) return i;
    let s = e.segments[o],
      a = t[r];
    if (gi(a)) break;
    let c = `${a}`,
      l = r < t.length - 1 ? t[r + 1] : null;
    if (o > 0 && c === void 0) break;
    if (c && l && typeof l == 'object' && l.outlets === void 0) {
      if (!lv(c, l, s)) return i;
      r += 2;
    } else {
      if (!lv(c, {}, s)) return i;
      r++;
    }
    o++;
  }
  return { match: !0, pathIndex: o, commandIndex: r };
}
function zd(e, n, t) {
  let r = e.segments.slice(0, n),
    o = 0;
  for (; o < t.length; ) {
    let i = t[o];
    if (gi(i)) {
      let c = Yw(i.outlets);
      return new q(r, c);
    }
    if (o === 0 && Fa(t[0])) {
      let c = e.segments[n];
      (r.push(new Jn(c.path, cv(t[0]))), o++);
      continue;
    }
    let s = gi(i) ? i.outlets[L] : `${i}`,
      a = o < t.length - 1 ? t[o + 1] : null;
    s && a && Fa(a) ? (r.push(new Jn(s, cv(a))), (o += 2)) : (r.push(new Jn(s, {})), o++);
  }
  return new q(r, {});
}
function Yw(e) {
  let n = {};
  return (
    Object.entries(e).forEach(([t, r]) => {
      (typeof r == 'string' && (r = [r]), r !== null && (n[t] = zd(new q([], {}), 0, r)));
    }),
    n
  );
}
function cv(e) {
  let n = {};
  return (Object.entries(e).forEach(([t, r]) => (n[t] = `${r}`)), n);
}
function lv(e, n, t) {
  return e == t.path && Mt(n, t.parameters);
}
var pi = 'imperative',
  _e = (function (e) {
    return (
      (e[(e.NavigationStart = 0)] = 'NavigationStart'),
      (e[(e.NavigationEnd = 1)] = 'NavigationEnd'),
      (e[(e.NavigationCancel = 2)] = 'NavigationCancel'),
      (e[(e.NavigationError = 3)] = 'NavigationError'),
      (e[(e.RoutesRecognized = 4)] = 'RoutesRecognized'),
      (e[(e.ResolveStart = 5)] = 'ResolveStart'),
      (e[(e.ResolveEnd = 6)] = 'ResolveEnd'),
      (e[(e.GuardsCheckStart = 7)] = 'GuardsCheckStart'),
      (e[(e.GuardsCheckEnd = 8)] = 'GuardsCheckEnd'),
      (e[(e.RouteConfigLoadStart = 9)] = 'RouteConfigLoadStart'),
      (e[(e.RouteConfigLoadEnd = 10)] = 'RouteConfigLoadEnd'),
      (e[(e.ChildActivationStart = 11)] = 'ChildActivationStart'),
      (e[(e.ChildActivationEnd = 12)] = 'ChildActivationEnd'),
      (e[(e.ActivationStart = 13)] = 'ActivationStart'),
      (e[(e.ActivationEnd = 14)] = 'ActivationEnd'),
      (e[(e.Scroll = 15)] = 'Scroll'),
      (e[(e.NavigationSkipped = 16)] = 'NavigationSkipped'),
      e
    );
  })(_e || {}),
  Xe = class {
    id;
    url;
    constructor(n, t) {
      ((this.id = n), (this.url = t));
    }
  },
  Qr = class extends Xe {
    type = _e.NavigationStart;
    navigationTrigger;
    restoredState;
    constructor(n, t, r = 'imperative', o = null) {
      (super(n, t), (this.navigationTrigger = r), (this.restoredState = o));
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  En = class extends Xe {
    urlAfterRedirects;
    type = _e.NavigationEnd;
    constructor(n, t, r) {
      (super(n, t), (this.urlAfterRedirects = r));
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Fe = (function (e) {
    return (
      (e[(e.Redirect = 0)] = 'Redirect'),
      (e[(e.SupersededByNewNavigation = 1)] = 'SupersededByNewNavigation'),
      (e[(e.NoDataFromResolver = 2)] = 'NoDataFromResolver'),
      (e[(e.GuardRejected = 3)] = 'GuardRejected'),
      (e[(e.Aborted = 4)] = 'Aborted'),
      e
    );
  })(Fe || {}),
  Ba = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = 'IgnoredSameUrlNavigation'),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] = 'IgnoredByUrlHandlingStrategy'),
      e
    );
  })(Ba || {}),
  Yt = class extends Xe {
    reason;
    code;
    type = _e.NavigationCancel;
    constructor(n, t, r, o) {
      (super(n, t), (this.reason = r), (this.code = o));
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Dn = class extends Xe {
    reason;
    code;
    type = _e.NavigationSkipped;
    constructor(n, t, r, o) {
      (super(n, t), (this.reason = r), (this.code = o));
    }
  },
  mi = class extends Xe {
    error;
    target;
    type = _e.NavigationError;
    constructor(n, t, r, o) {
      (super(n, t), (this.error = r), (this.target = o));
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  Va = class extends Xe {
    urlAfterRedirects;
    state;
    type = _e.RoutesRecognized;
    constructor(n, t, r, o) {
      (super(n, t), (this.urlAfterRedirects = r), (this.state = o));
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Gd = class extends Xe {
    urlAfterRedirects;
    state;
    type = _e.GuardsCheckStart;
    constructor(n, t, r, o) {
      (super(n, t), (this.urlAfterRedirects = r), (this.state = o));
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Wd = class extends Xe {
    urlAfterRedirects;
    state;
    shouldActivate;
    type = _e.GuardsCheckEnd;
    constructor(n, t, r, o, i) {
      (super(n, t), (this.urlAfterRedirects = r), (this.state = o), (this.shouldActivate = i));
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  qd = class extends Xe {
    urlAfterRedirects;
    state;
    type = _e.ResolveStart;
    constructor(n, t, r, o) {
      (super(n, t), (this.urlAfterRedirects = r), (this.state = o));
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Zd = class extends Xe {
    urlAfterRedirects;
    state;
    type = _e.ResolveEnd;
    constructor(n, t, r, o) {
      (super(n, t), (this.urlAfterRedirects = r), (this.state = o));
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Yd = class {
    route;
    type = _e.RouteConfigLoadStart;
    constructor(n) {
      this.route = n;
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Qd = class {
    route;
    type = _e.RouteConfigLoadEnd;
    constructor(n) {
      this.route = n;
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Kd = class {
    snapshot;
    type = _e.ChildActivationStart;
    constructor(n) {
      this.snapshot = n;
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  Jd = class {
    snapshot;
    type = _e.ChildActivationEnd;
    constructor(n) {
      this.snapshot = n;
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  Xd = class {
    snapshot;
    type = _e.ActivationStart;
    constructor(n) {
      this.snapshot = n;
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  ef = class {
    snapshot;
    type = _e.ActivationEnd;
    constructor(n) {
      this.snapshot = n;
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  };
var vi = class {},
  Kr = class {
    url;
    navigationBehaviorOptions;
    constructor(n, t) {
      ((this.url = n), (this.navigationBehaviorOptions = t));
    }
  };
function Qw(e) {
  return !(e instanceof vi) && !(e instanceof Kr);
}
function Kw(e, n) {
  return (
    e.providers && !e._injector && (e._injector = Zo(e.providers, n, `Route: ${e.path}`)),
    e._injector ?? n
  );
}
function lt(e) {
  return e.outlet || L;
}
function Jw(e, n) {
  let t = e.filter((r) => lt(r) === n);
  return (t.push(...e.filter((r) => lt(r) !== n)), t);
}
function Xr(e) {
  if (!e) return null;
  if (e.routeConfig?._injector) return e.routeConfig._injector;
  for (let n = e.parent; n; n = n.parent) {
    let t = n.routeConfig;
    if (t?._loadedInjector) return t._loadedInjector;
    if (t?._injector) return t._injector;
  }
  return null;
}
var tf = class {
    rootInjector;
    outlet = null;
    route = null;
    children;
    attachRef = null;
    get injector() {
      return Xr(this.route?.snapshot) ?? this.rootInjector;
    }
    constructor(n) {
      ((this.rootInjector = n), (this.children = new Ii(this.rootInjector)));
    }
  },
  Ii = (() => {
    class e {
      rootInjector;
      contexts = new Map();
      constructor(t) {
        this.rootInjector = t;
      }
      onChildOutletCreated(t, r) {
        let o = this.getOrCreateContext(t);
        ((o.outlet = r), this.contexts.set(t, o));
      }
      onChildOutletDestroyed(t) {
        let r = this.getContext(t);
        r && ((r.outlet = null), (r.attachRef = null));
      }
      onOutletDeactivated() {
        let t = this.contexts;
        return ((this.contexts = new Map()), t);
      }
      onOutletReAttached(t) {
        this.contexts = t;
      }
      getOrCreateContext(t) {
        let r = this.getContext(t);
        return (r || ((r = new tf(this.rootInjector)), this.contexts.set(t, r)), r);
      }
      getContext(t) {
        return this.contexts.get(t) || null;
      }
      static ɵfac = function (r) {
        return new (r || e)(M(me));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  Ua = class {
    _root;
    constructor(n) {
      this._root = n;
    }
    get root() {
      return this._root.value;
    }
    parent(n) {
      let t = this.pathFromRoot(n);
      return t.length > 1 ? t[t.length - 2] : null;
    }
    children(n) {
      let t = nf(n, this._root);
      return t ? t.children.map((r) => r.value) : [];
    }
    firstChild(n) {
      let t = nf(n, this._root);
      return t && t.children.length > 0 ? t.children[0].value : null;
    }
    siblings(n) {
      let t = rf(n, this._root);
      return t.length < 2
        ? []
        : t[t.length - 2].children.map((o) => o.value).filter((o) => o !== n);
    }
    pathFromRoot(n) {
      return rf(n, this._root).map((t) => t.value);
    }
  };
function nf(e, n) {
  if (e === n.value) return n;
  for (let t of n.children) {
    let r = nf(e, t);
    if (r) return r;
  }
  return null;
}
function rf(e, n) {
  if (e === n.value) return [n];
  for (let t of n.children) {
    let r = rf(e, t);
    if (r.length) return (r.unshift(n), r);
  }
  return [];
}
var We = class {
  value;
  children;
  constructor(n, t) {
    ((this.value = n), (this.children = t));
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Hr(e) {
  let n = {};
  return (e && e.children.forEach((t) => (n[t.value.outlet] = t)), n);
}
var $a = class extends Ua {
  snapshot;
  constructor(n, t) {
    (super(n), (this.snapshot = t), pf(this, n));
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Sv(e) {
  let n = Xw(e),
    t = new pe([new Jn('', {})]),
    r = new pe({}),
    o = new pe({}),
    i = new pe({}),
    s = new pe(''),
    a = new er(t, r, i, s, o, L, e, n.root);
  return ((a.snapshot = n.root), new $a(new We(a, []), n));
}
function Xw(e) {
  let n = {},
    t = {},
    r = {},
    i = new Gr([], n, r, '', t, L, e, null, {});
  return new za('', new We(i, []));
}
var er = class {
  urlSubject;
  paramsSubject;
  queryParamsSubject;
  fragmentSubject;
  dataSubject;
  outlet;
  component;
  snapshot;
  _futureSnapshot;
  _routerState;
  _paramMap;
  _queryParamMap;
  title;
  url;
  params;
  queryParams;
  fragment;
  data;
  constructor(n, t, r, o, i, s, a, c) {
    ((this.urlSubject = n),
      (this.paramsSubject = t),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = o),
      (this.dataSubject = i),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(A((l) => l[bi])) ?? S(void 0)),
      (this.url = n),
      (this.params = t),
      (this.queryParams = r),
      (this.fragment = o),
      (this.data = i));
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return ((this._paramMap ??= this.params.pipe(A((n) => qr(n)))), this._paramMap);
  }
  get queryParamMap() {
    return ((this._queryParamMap ??= this.queryParams.pipe(A((n) => qr(n)))), this._queryParamMap);
  }
  toString() {
    return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
  }
};
function Ha(e, n, t = 'emptyOnly') {
  let r,
    { routeConfig: o } = e;
  return (
    n !== null &&
    (t === 'always' || o?.path === '' || (!n.component && !n.routeConfig?.loadComponent))
      ? (r = {
          params: C(C({}, n.params), e.params),
          data: C(C({}, n.data), e.data),
          resolve: C(C(C(C({}, e.data), n.data), o?.data), e._resolvedData),
        })
      : (r = {
          params: C({}, e.params),
          data: C({}, e.data),
          resolve: C(C({}, e.data), e._resolvedData ?? {}),
        }),
    o && Nv(o) && (r.resolve[bi] = o.title),
    r
  );
}
var Gr = class {
    url;
    params;
    queryParams;
    fragment;
    data;
    outlet;
    component;
    routeConfig;
    _resolve;
    _resolvedData;
    _routerState;
    _paramMap;
    _queryParamMap;
    get title() {
      return this.data?.[bi];
    }
    constructor(n, t, r, o, i, s, a, c, l) {
      ((this.url = n),
        (this.params = t),
        (this.queryParams = r),
        (this.fragment = o),
        (this.data = i),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = l));
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return ((this._paramMap ??= qr(this.params)), this._paramMap);
    }
    get queryParamMap() {
      return ((this._queryParamMap ??= qr(this.queryParams)), this._queryParamMap);
    }
    toString() {
      let n = this.url.map((r) => r.toString()).join('/'),
        t = this.routeConfig ? this.routeConfig.path : '';
      return `Route(url:'${n}', path:'${t}')`;
    }
  },
  za = class extends Ua {
    url;
    constructor(n, t) {
      (super(t), (this.url = n), pf(this, t));
    }
    toString() {
      return Mv(this._root);
    }
  };
function pf(e, n) {
  ((n.value._routerState = e), n.children.forEach((t) => pf(e, t)));
}
function Mv(e) {
  let n = e.children.length > 0 ? ` { ${e.children.map(Mv).join(', ')} } ` : '';
  return `${e.value}${n}`;
}
function jd(e) {
  if (e.snapshot) {
    let n = e.snapshot,
      t = e._futureSnapshot;
    ((e.snapshot = t),
      Mt(n.queryParams, t.queryParams) || e.queryParamsSubject.next(t.queryParams),
      n.fragment !== t.fragment && e.fragmentSubject.next(t.fragment),
      Mt(n.params, t.params) || e.paramsSubject.next(t.params),
      _w(n.url, t.url) || e.urlSubject.next(t.url),
      Mt(n.data, t.data) || e.dataSubject.next(t.data));
  } else ((e.snapshot = e._futureSnapshot), e.dataSubject.next(e._futureSnapshot.data));
}
function of(e, n) {
  let t = Mt(e.params, n.params) && Nw(e.url, n.url),
    r = !e.parent != !n.parent;
  return t && !r && (!e.parent || of(e.parent, n.parent));
}
function Nv(e) {
  return typeof e.title == 'string' || e.title === null;
}
var e0 = new T(''),
  xv = (() => {
    class e {
      activated = null;
      get activatedComponentRef() {
        return this.activated;
      }
      _activatedRoute = null;
      name = L;
      activateEvents = new ye();
      deactivateEvents = new ye();
      attachEvents = new ye();
      detachEvents = new ye();
      routerOutletData = Em(void 0);
      parentContexts = h(Ii);
      location = h(qo);
      changeDetector = h(Xo);
      inputBinder = h(Za, { optional: !0 });
      supportsBindingToComponentInputs = !0;
      ngOnChanges(t) {
        if (t.name) {
          let { firstChange: r, previousValue: o } = t.name;
          if (r) return;
          (this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName());
        }
      }
      ngOnDestroy() {
        (this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this));
      }
      isTrackedInParentContexts(t) {
        return this.parentContexts.getContext(t)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if ((this.parentContexts.onChildOutletCreated(this.name, this), this.activated)) return;
        let t = this.parentContexts.getContext(this.name);
        t?.route &&
          (t.attachRef
            ? this.attach(t.attachRef, t.route)
            : this.activateWith(t.route, t.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new b(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new b(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new b(4012, !1);
        this.location.detach();
        let t = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(t.instance),
          t
        );
      }
      attach(t, r) {
        ((this.activated = t),
          (this._activatedRoute = r),
          this.location.insert(t.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(t.instance));
      }
      deactivate() {
        if (this.activated) {
          let t = this.component;
          (this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(t));
        }
      }
      activateWith(t, r) {
        if (this.isActivated) throw new b(4013, !1);
        this._activatedRoute = t;
        let o = this.location,
          s = t.snapshot.component,
          a = this.parentContexts.getOrCreateContext(this.name).children,
          c = new sf(t, a, o.injector, this.routerOutletData);
        ((this.activated = o.createComponent(s, {
          index: o.length,
          injector: c,
          environmentInjector: r,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = Nr({
        type: e,
        selectors: [['router-outlet']],
        inputs: { name: 'name', routerOutletData: [1, 'routerOutletData'] },
        outputs: {
          activateEvents: 'activate',
          deactivateEvents: 'deactivate',
          attachEvents: 'attach',
          detachEvents: 'detach',
        },
        exportAs: ['outlet'],
        features: [gn],
      });
    }
    return e;
  })(),
  sf = class {
    route;
    childContexts;
    parent;
    outletData;
    constructor(n, t, r, o) {
      ((this.route = n), (this.childContexts = t), (this.parent = r), (this.outletData = o));
    }
    get(n, t) {
      return n === er
        ? this.route
        : n === Ii
          ? this.childContexts
          : n === e0
            ? this.outletData
            : this.parent.get(n, t);
    }
  },
  Za = new T('');
var Rv = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵcmp = Me({
      type: e,
      selectors: [['ng-component']],
      exportAs: ['emptyRouterOutlet'],
      decls: 1,
      vars: 0,
      template: function (r, o) {
        r & 1 && ce(0, 'router-outlet');
      },
      dependencies: [xv],
      encapsulation: 2,
    });
  }
  return e;
})();
function hf(e) {
  let n = e.children && e.children.map(hf),
    t = n ? J(C({}, e), { children: n }) : C({}, e);
  return (
    !t.component &&
      !t.loadComponent &&
      (n || t.loadChildren) &&
      t.outlet &&
      t.outlet !== L &&
      (t.component = Rv),
    t
  );
}
function t0(e, n, t) {
  let r = yi(e, n._root, t ? t._root : void 0);
  return new $a(r, n);
}
function yi(e, n, t) {
  if (t && e.shouldReuseRoute(n.value, t.value.snapshot)) {
    let r = t.value;
    r._futureSnapshot = n.value;
    let o = n0(e, n, t);
    return new We(r, o);
  } else {
    if (e.shouldAttach(n.value)) {
      let i = e.retrieve(n.value);
      if (i !== null) {
        let s = i.route;
        return (
          (s.value._futureSnapshot = n.value),
          (s.children = n.children.map((a) => yi(e, a))),
          s
        );
      }
    }
    let r = r0(n.value),
      o = n.children.map((i) => yi(e, i));
    return new We(r, o);
  }
}
function n0(e, n, t) {
  return n.children.map((r) => {
    for (let o of t.children) if (e.shouldReuseRoute(r.value, o.value.snapshot)) return yi(e, r, o);
    return yi(e, r);
  });
}
function r0(e) {
  return new er(
    new pe(e.url),
    new pe(e.params),
    new pe(e.queryParams),
    new pe(e.fragment),
    new pe(e.data),
    e.outlet,
    e.component,
    e,
  );
}
var Ei = class {
    redirectTo;
    navigationBehaviorOptions;
    constructor(n, t) {
      ((this.redirectTo = n), (this.navigationBehaviorOptions = t));
    }
  },
  Av = 'ngNavigationCancelingError';
function Ga(e, n) {
  let { redirectTo: t, navigationBehaviorOptions: r } = Yr(n)
      ? { redirectTo: n, navigationBehaviorOptions: void 0 }
      : n,
    o = Ov(!1, Fe.Redirect);
  return ((o.url = t), (o.navigationBehaviorOptions = r), o);
}
function Ov(e, n) {
  let t = new Error(`NavigationCancelingError: ${e || ''}`);
  return ((t[Av] = !0), (t.cancellationCode = n), t);
}
function o0(e) {
  return kv(e) && Yr(e.url);
}
function kv(e) {
  return !!e && e[Av];
}
var i0 = (e, n, t, r) =>
    A((o) => (new af(n, o.targetRouterState, o.currentRouterState, t, r).activate(e), o)),
  af = class {
    routeReuseStrategy;
    futureState;
    currState;
    forwardEvent;
    inputBindingEnabled;
    constructor(n, t, r, o, i) {
      ((this.routeReuseStrategy = n),
        (this.futureState = t),
        (this.currState = r),
        (this.forwardEvent = o),
        (this.inputBindingEnabled = i));
    }
    activate(n) {
      let t = this.futureState._root,
        r = this.currState ? this.currState._root : null;
      (this.deactivateChildRoutes(t, r, n),
        jd(this.futureState.root),
        this.activateChildRoutes(t, r, n));
    }
    deactivateChildRoutes(n, t, r) {
      let o = Hr(t);
      (n.children.forEach((i) => {
        let s = i.value.outlet;
        (this.deactivateRoutes(i, o[s], r), delete o[s]);
      }),
        Object.values(o).forEach((i) => {
          this.deactivateRouteAndItsChildren(i, r);
        }));
    }
    deactivateRoutes(n, t, r) {
      let o = n.value,
        i = t ? t.value : null;
      if (o === i)
        if (o.component) {
          let s = r.getContext(o.outlet);
          s && this.deactivateChildRoutes(n, t, s.children);
        } else this.deactivateChildRoutes(n, t, r);
      else i && this.deactivateRouteAndItsChildren(t, r);
    }
    deactivateRouteAndItsChildren(n, t) {
      n.value.component && this.routeReuseStrategy.shouldDetach(n.value.snapshot)
        ? this.detachAndStoreRouteSubtree(n, t)
        : this.deactivateRouteAndOutlet(n, t);
    }
    detachAndStoreRouteSubtree(n, t) {
      let r = t.getContext(n.value.outlet),
        o = r && n.value.component ? r.children : t,
        i = Hr(n);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      if (r && r.outlet) {
        let s = r.outlet.detach(),
          a = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(n.value.snapshot, { componentRef: s, route: n, contexts: a });
      }
    }
    deactivateRouteAndOutlet(n, t) {
      let r = t.getContext(n.value.outlet),
        o = r && n.value.component ? r.children : t,
        i = Hr(n);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(n, t, r) {
      let o = Hr(t);
      (n.children.forEach((i) => {
        (this.activateRoutes(i, o[i.value.outlet], r), this.forwardEvent(new ef(i.value.snapshot)));
      }),
        n.children.length && this.forwardEvent(new Jd(n.value.snapshot)));
    }
    activateRoutes(n, t, r) {
      let o = n.value,
        i = t ? t.value : null;
      if ((jd(o), o === i))
        if (o.component) {
          let s = r.getOrCreateContext(o.outlet);
          this.activateChildRoutes(n, t, s.children);
        } else this.activateChildRoutes(n, t, r);
      else if (o.component) {
        let s = r.getOrCreateContext(o.outlet);
        if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(o.snapshot);
          (this.routeReuseStrategy.store(o.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            jd(a.route.value),
            this.activateChildRoutes(n, null, s.children));
        } else
          ((s.attachRef = null),
            (s.route = o),
            s.outlet && s.outlet.activateWith(o, s.injector),
            this.activateChildRoutes(n, null, s.children));
      } else this.activateChildRoutes(n, null, r);
    }
  },
  Wa = class {
    path;
    route;
    constructor(n) {
      ((this.path = n), (this.route = this.path[this.path.length - 1]));
    }
  },
  Wr = class {
    component;
    route;
    constructor(n, t) {
      ((this.component = n), (this.route = t));
    }
  };
function s0(e, n, t) {
  let r = e._root,
    o = n ? n._root : null;
  return di(r, o, t, [r.value]);
}
function a0(e) {
  let n = e.routeConfig ? e.routeConfig.canActivateChild : null;
  return !n || n.length === 0 ? null : { node: e, guards: n };
}
function eo(e, n) {
  let t = Symbol(),
    r = n.get(e, t);
  return r === t ? (typeof e == 'function' && !Yc(e) ? e : n.get(e)) : r;
}
function di(e, n, t, r, o = { canDeactivateChecks: [], canActivateChecks: [] }) {
  let i = Hr(n);
  return (
    e.children.forEach((s) => {
      (c0(s, i[s.value.outlet], t, r.concat([s.value]), o), delete i[s.value.outlet]);
    }),
    Object.entries(i).forEach(([s, a]) => hi(a, t.getContext(s), o)),
    o
  );
}
function c0(e, n, t, r, o = { canDeactivateChecks: [], canActivateChecks: [] }) {
  let i = e.value,
    s = n ? n.value : null,
    a = t ? t.getContext(e.value.outlet) : null;
  if (s && i.routeConfig === s.routeConfig) {
    let c = l0(s, i, i.routeConfig.runGuardsAndResolvers);
    (c
      ? o.canActivateChecks.push(new Wa(r))
      : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
      i.component ? di(e, n, a ? a.children : null, r, o) : di(e, n, t, r, o),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        o.canDeactivateChecks.push(new Wr(a.outlet.component, s)));
  } else
    (s && hi(n, a, o),
      o.canActivateChecks.push(new Wa(r)),
      i.component ? di(e, null, a ? a.children : null, r, o) : di(e, null, t, r, o));
  return o;
}
function l0(e, n, t) {
  if (typeof t == 'function') return t(e, n);
  switch (t) {
    case 'pathParamsChange':
      return !Xn(e.url, n.url);
    case 'pathParamsOrQueryParamsChange':
      return !Xn(e.url, n.url) || !Mt(e.queryParams, n.queryParams);
    case 'always':
      return !0;
    case 'paramsOrQueryParamsChange':
      return !of(e, n) || !Mt(e.queryParams, n.queryParams);
    case 'paramsChange':
    default:
      return !of(e, n);
  }
}
function hi(e, n, t) {
  let r = Hr(e),
    o = e.value;
  (Object.entries(r).forEach(([i, s]) => {
    o.component ? (n ? hi(s, n.children.getContext(i), t) : hi(s, null, t)) : hi(s, n, t);
  }),
    o.component
      ? n && n.outlet && n.outlet.isActivated
        ? t.canDeactivateChecks.push(new Wr(n.outlet.component, o))
        : t.canDeactivateChecks.push(new Wr(null, o))
      : t.canDeactivateChecks.push(new Wr(null, o)));
}
function wi(e) {
  return typeof e == 'function';
}
function u0(e) {
  return typeof e == 'boolean';
}
function d0(e) {
  return e && wi(e.canLoad);
}
function f0(e) {
  return e && wi(e.canActivate);
}
function p0(e) {
  return e && wi(e.canActivateChild);
}
function h0(e) {
  return e && wi(e.canDeactivate);
}
function g0(e) {
  return e && wi(e.canMatch);
}
function Pv(e) {
  return e instanceof Rt || e?.name === 'EmptyError';
}
var Oa = Symbol('INITIAL_VALUE');
function Jr() {
  return ge((e) =>
    ns(e.map((n) => n.pipe(ke(1), Pc(Oa)))).pipe(
      A((n) => {
        for (let t of n)
          if (t !== !0) {
            if (t === Oa) return Oa;
            if (t === !1 || m0(t)) return t;
          }
        return !0;
      }),
      Oe((n) => n !== Oa),
      ke(1),
    ),
  );
}
function m0(e) {
  return Yr(e) || e instanceof Ei;
}
function v0(e, n) {
  return he((t) => {
    let {
      targetSnapshot: r,
      currentSnapshot: o,
      guards: { canActivateChecks: i, canDeactivateChecks: s },
    } = t;
    return s.length === 0 && i.length === 0
      ? S(J(C({}, t), { guardsResult: !0 }))
      : y0(s, r, o, e).pipe(
          he((a) => (a && u0(a) ? E0(r, i, e, n) : S(a))),
          A((a) => J(C({}, t), { guardsResult: a })),
        );
  });
}
function y0(e, n, t, r) {
  return ue(e).pipe(
    he((o) => w0(o.component, o.route, t, n, r)),
    Ot((o) => o !== !0, !0),
  );
}
function E0(e, n, t, r) {
  return ue(n).pipe(
    ft((o) => At(C0(o.route.parent, r), D0(o.route, r), I0(e, o.path, t), b0(e, o.route, t))),
    Ot((o) => o !== !0, !0),
  );
}
function D0(e, n) {
  return (e !== null && n && n(new Xd(e)), S(!0));
}
function C0(e, n) {
  return (e !== null && n && n(new Kd(e)), S(!0));
}
function b0(e, n, t) {
  let r = n.routeConfig ? n.routeConfig.canActivate : null;
  if (!r || r.length === 0) return S(!0);
  let o = r.map((i) =>
    tn(() => {
      let s = Xr(n) ?? t,
        a = eo(i, s),
        c = f0(a) ? a.canActivate(n, e) : Ie(s, () => a(n, e));
      return Kt(c).pipe(Ot());
    }),
  );
  return S(o).pipe(Jr());
}
function I0(e, n, t) {
  let r = n[n.length - 1],
    i = n
      .slice(0, n.length - 1)
      .reverse()
      .map((s) => a0(s))
      .filter((s) => s !== null)
      .map((s) =>
        tn(() => {
          let a = s.guards.map((c) => {
            let l = Xr(s.node) ?? t,
              u = eo(c, l),
              d = p0(u) ? u.canActivateChild(r, e) : Ie(l, () => u(r, e));
            return Kt(d).pipe(Ot());
          });
          return S(a).pipe(Jr());
        }),
      );
  return S(i).pipe(Jr());
}
function w0(e, n, t, r, o) {
  let i = n && n.routeConfig ? n.routeConfig.canDeactivate : null;
  if (!i || i.length === 0) return S(!0);
  let s = i.map((a) => {
    let c = Xr(n) ?? o,
      l = eo(a, c),
      u = h0(l) ? l.canDeactivate(e, n, t, r) : Ie(c, () => l(e, n, t, r));
    return Kt(u).pipe(Ot());
  });
  return S(s).pipe(Jr());
}
function _0(e, n, t, r) {
  let o = n.canLoad;
  if (o === void 0 || o.length === 0) return S(!0);
  let i = o.map((s) => {
    let a = eo(s, e),
      c = d0(a) ? a.canLoad(n, t) : Ie(e, () => a(n, t));
    return Kt(c);
  });
  return S(i).pipe(Jr(), Lv(r));
}
function Lv(e) {
  return Tc(
    Ce((n) => {
      if (typeof n != 'boolean') throw Ga(e, n);
    }),
    A((n) => n === !0),
  );
}
function T0(e, n, t, r) {
  let o = n.canMatch;
  if (!o || o.length === 0) return S(!0);
  let i = o.map((s) => {
    let a = eo(s, e),
      c = g0(a) ? a.canMatch(n, t) : Ie(e, () => a(n, t));
    return Kt(c);
  });
  return S(i).pipe(Jr(), Lv(r));
}
var Di = class {
    segmentGroup;
    constructor(n) {
      this.segmentGroup = n || null;
    }
  },
  Ci = class extends Error {
    urlTree;
    constructor(n) {
      (super(), (this.urlTree = n));
    }
  };
function $r(e) {
  return dr(new Di(e));
}
function S0(e) {
  return dr(new b(4e3, !1));
}
function M0(e) {
  return dr(Ov(!1, Fe.GuardRejected));
}
var cf = class {
  urlSerializer;
  urlTree;
  constructor(n, t) {
    ((this.urlSerializer = n), (this.urlTree = t));
  }
  lineralizeSegments(n, t) {
    let r = [],
      o = t.root;
    for (;;) {
      if (((r = r.concat(o.segments)), o.numberOfChildren === 0)) return S(r);
      if (o.numberOfChildren > 1 || !o.children[L]) return S0(`${n.redirectTo}`);
      o = o.children[L];
    }
  }
  applyRedirectCommands(n, t, r, o, i) {
    return N0(t, o, i).pipe(
      A((s) => {
        if (s instanceof Qt) throw new Ci(s);
        let a = this.applyRedirectCreateUrlTree(s, this.urlSerializer.parse(s), n, r);
        if (s[0] === '/') throw new Ci(a);
        return a;
      }),
    );
  }
  applyRedirectCreateUrlTree(n, t, r, o) {
    let i = this.createSegmentGroup(n, t.root, r, o);
    return new Qt(i, this.createQueryParams(t.queryParams, this.urlTree.queryParams), t.fragment);
  }
  createQueryParams(n, t) {
    let r = {};
    return (
      Object.entries(n).forEach(([o, i]) => {
        if (typeof i == 'string' && i[0] === ':') {
          let a = i.substring(1);
          r[o] = t[a];
        } else r[o] = i;
      }),
      r
    );
  }
  createSegmentGroup(n, t, r, o) {
    let i = this.createSegments(n, t.segments, r, o),
      s = {};
    return (
      Object.entries(t.children).forEach(([a, c]) => {
        s[a] = this.createSegmentGroup(n, c, r, o);
      }),
      new q(i, s)
    );
  }
  createSegments(n, t, r, o) {
    return t.map((i) => (i.path[0] === ':' ? this.findPosParam(n, i, o) : this.findOrReturn(i, r)));
  }
  findPosParam(n, t, r) {
    let o = r[t.path.substring(1)];
    if (!o) throw new b(4001, !1);
    return o;
  }
  findOrReturn(n, t) {
    let r = 0;
    for (let o of t) {
      if (o.path === n.path) return (t.splice(r), o);
      r++;
    }
    return n;
  }
};
function N0(e, n, t) {
  if (typeof e == 'string') return S(e);
  let r = e,
    {
      queryParams: o,
      fragment: i,
      routeConfig: s,
      url: a,
      outlet: c,
      params: l,
      data: u,
      title: d,
    } = n;
  return Kt(
    Ie(t, () =>
      r({
        params: l,
        data: u,
        queryParams: o,
        fragment: i,
        routeConfig: s,
        url: a,
        outlet: c,
        title: d,
      }),
    ),
  );
}
var lf = {
  matched: !1,
  consumedSegments: [],
  remainingSegments: [],
  parameters: {},
  positionalParamSegments: {},
};
function x0(e, n, t, r, o) {
  let i = Fv(e, n, t);
  return i.matched
    ? ((r = Kw(n, r)), T0(r, n, t, o).pipe(A((s) => (s === !0 ? i : C({}, lf)))))
    : S(i);
}
function Fv(e, n, t) {
  if (n.path === '**') return R0(t);
  if (n.path === '')
    return n.pathMatch === 'full' && (e.hasChildren() || t.length > 0)
      ? C({}, lf)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: t,
          parameters: {},
          positionalParamSegments: {},
        };
  let o = (n.matcher || ww)(t, e, n);
  if (!o) return C({}, lf);
  let i = {};
  Object.entries(o.posParams ?? {}).forEach(([a, c]) => {
    i[a] = c.path;
  });
  let s = o.consumed.length > 0 ? C(C({}, i), o.consumed[o.consumed.length - 1].parameters) : i;
  return {
    matched: !0,
    consumedSegments: o.consumed,
    remainingSegments: t.slice(o.consumed.length),
    parameters: s,
    positionalParamSegments: o.posParams ?? {},
  };
}
function R0(e) {
  return {
    matched: !0,
    parameters: e.length > 0 ? hv(e).parameters : {},
    consumedSegments: e,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function uv(e, n, t, r) {
  return t.length > 0 && k0(e, t, r)
    ? { segmentGroup: new q(n, O0(r, new q(t, e.children))), slicedSegments: [] }
    : t.length === 0 && P0(e, t, r)
      ? { segmentGroup: new q(e.segments, A0(e, t, r, e.children)), slicedSegments: t }
      : { segmentGroup: new q(e.segments, e.children), slicedSegments: t };
}
function A0(e, n, t, r) {
  let o = {};
  for (let i of t)
    if (Ya(e, n, i) && !r[lt(i)]) {
      let s = new q([], {});
      o[lt(i)] = s;
    }
  return C(C({}, r), o);
}
function O0(e, n) {
  let t = {};
  t[L] = n;
  for (let r of e)
    if (r.path === '' && lt(r) !== L) {
      let o = new q([], {});
      t[lt(r)] = o;
    }
  return t;
}
function k0(e, n, t) {
  return t.some((r) => Ya(e, n, r) && lt(r) !== L);
}
function P0(e, n, t) {
  return t.some((r) => Ya(e, n, r));
}
function Ya(e, n, t) {
  return (e.hasChildren() || n.length > 0) && t.pathMatch === 'full' ? !1 : t.path === '';
}
function L0(e, n, t) {
  return n.length === 0 && !e.children[t];
}
var uf = class {};
function F0(e, n, t, r, o, i, s = 'emptyOnly') {
  return new df(e, n, t, r, o, s, i).recognize();
}
var j0 = 31,
  df = class {
    injector;
    configLoader;
    rootComponentType;
    config;
    urlTree;
    paramsInheritanceStrategy;
    urlSerializer;
    applyRedirects;
    absoluteRedirectCount = 0;
    allowRedirects = !0;
    constructor(n, t, r, o, i, s, a) {
      ((this.injector = n),
        (this.configLoader = t),
        (this.rootComponentType = r),
        (this.config = o),
        (this.urlTree = i),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new cf(this.urlSerializer, this.urlTree)));
    }
    noMatchError(n) {
      return new b(4002, `'${n.segmentGroup}'`);
    }
    recognize() {
      let n = uv(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(n).pipe(
        A(({ children: t, rootSnapshot: r }) => {
          let o = new We(r, t),
            i = new za('', o),
            s = Hw(r, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (i.url = this.urlSerializer.serialize(s)),
            { state: i, tree: s }
          );
        }),
      );
    }
    match(n) {
      let t = new Gr(
        [],
        Object.freeze({}),
        Object.freeze(C({}, this.urlTree.queryParams)),
        this.urlTree.fragment,
        Object.freeze({}),
        L,
        this.rootComponentType,
        null,
        {},
      );
      return this.processSegmentGroup(this.injector, this.config, n, L, t).pipe(
        A((r) => ({ children: r, rootSnapshot: t })),
        nn((r) => {
          if (r instanceof Ci) return ((this.urlTree = r.urlTree), this.match(r.urlTree.root));
          throw r instanceof Di ? this.noMatchError(r) : r;
        }),
      );
    }
    processSegmentGroup(n, t, r, o, i) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(n, t, r, i)
        : this.processSegment(n, t, r, r.segments, o, !0, i).pipe(
            A((s) => (s instanceof We ? [s] : [])),
          );
    }
    processChildren(n, t, r, o) {
      let i = [];
      for (let s of Object.keys(r.children)) s === 'primary' ? i.unshift(s) : i.push(s);
      return ue(i).pipe(
        ft((s) => {
          let a = r.children[s],
            c = Jw(t, s);
          return this.processSegmentGroup(n, c, a, s, o);
        }),
        Oc((s, a) => (s.push(...a), s)),
        rn(null),
        Ac(),
        he((s) => {
          if (s === null) return $r(r);
          let a = jv(s);
          return (B0(a), S(a));
        }),
      );
    }
    processSegment(n, t, r, o, i, s, a) {
      return ue(t).pipe(
        ft((c) =>
          this.processSegmentAgainstRoute(c._injector ?? n, t, c, r, o, i, s, a).pipe(
            nn((l) => {
              if (l instanceof Di) return S(null);
              throw l;
            }),
          ),
        ),
        Ot((c) => !!c),
        nn((c) => {
          if (Pv(c)) return L0(r, o, i) ? S(new uf()) : $r(r);
          throw c;
        }),
      );
    }
    processSegmentAgainstRoute(n, t, r, o, i, s, a, c) {
      return lt(r) !== s && (s === L || !Ya(o, i, r))
        ? $r(o)
        : r.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(n, o, r, i, s, c)
          : this.allowRedirects && a
            ? this.expandSegmentAgainstRouteUsingRedirect(n, o, t, r, i, s, c)
            : $r(o);
    }
    expandSegmentAgainstRouteUsingRedirect(n, t, r, o, i, s, a) {
      let {
        matched: c,
        parameters: l,
        consumedSegments: u,
        positionalParamSegments: d,
        remainingSegments: p,
      } = Fv(t, o, i);
      if (!c) return $r(t);
      typeof o.redirectTo == 'string' &&
        o.redirectTo[0] === '/' &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > j0 && (this.allowRedirects = !1));
      let f = new Gr(
          i,
          l,
          Object.freeze(C({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          dv(o),
          lt(o),
          o.component ?? o._loadedComponent ?? null,
          o,
          fv(o),
        ),
        m = Ha(f, a, this.paramsInheritanceStrategy);
      return (
        (f.params = Object.freeze(m.params)),
        (f.data = Object.freeze(m.data)),
        this.applyRedirects.applyRedirectCommands(u, o.redirectTo, d, f, n).pipe(
          ge((I) => this.applyRedirects.lineralizeSegments(o, I)),
          he((I) => this.processSegment(n, r, t, I.concat(p), s, !1, a)),
        )
      );
    }
    matchSegmentAgainstRoute(n, t, r, o, i, s) {
      let a = x0(t, r, o, n, this.urlSerializer);
      return (
        r.path === '**' && (t.children = {}),
        a.pipe(
          ge((c) =>
            c.matched
              ? ((n = r._injector ?? n),
                this.getChildConfig(n, r, o).pipe(
                  ge(({ routes: l }) => {
                    let u = r._loadedInjector ?? n,
                      { parameters: d, consumedSegments: p, remainingSegments: f } = c,
                      m = new Gr(
                        p,
                        d,
                        Object.freeze(C({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        dv(r),
                        lt(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        fv(r),
                      ),
                      _ = Ha(m, s, this.paramsInheritanceStrategy);
                    ((m.params = Object.freeze(_.params)), (m.data = Object.freeze(_.data)));
                    let { segmentGroup: I, slicedSegments: D } = uv(t, p, f, l);
                    if (D.length === 0 && I.hasChildren())
                      return this.processChildren(u, l, I, m).pipe(A((De) => new We(m, De)));
                    if (l.length === 0 && D.length === 0) return S(new We(m, []));
                    let z = lt(r) === i;
                    return this.processSegment(u, l, I, D, z ? L : i, !0, m).pipe(
                      A((De) => new We(m, De instanceof We ? [De] : [])),
                    );
                  }),
                ))
              : $r(t),
          ),
        )
      );
    }
    getChildConfig(n, t, r) {
      return t.children
        ? S({ routes: t.children, injector: n })
        : t.loadChildren
          ? t._loadedRoutes !== void 0
            ? S({ routes: t._loadedRoutes, injector: t._loadedInjector })
            : _0(n, t, r, this.urlSerializer).pipe(
                he((o) =>
                  o
                    ? this.configLoader.loadChildren(n, t).pipe(
                        Ce((i) => {
                          ((t._loadedRoutes = i.routes), (t._loadedInjector = i.injector));
                        }),
                      )
                    : M0(t),
                ),
              )
          : S({ routes: [], injector: n });
    }
  };
function B0(e) {
  e.sort((n, t) =>
    n.value.outlet === L
      ? -1
      : t.value.outlet === L
        ? 1
        : n.value.outlet.localeCompare(t.value.outlet),
  );
}
function V0(e) {
  let n = e.value.routeConfig;
  return n && n.path === '';
}
function jv(e) {
  let n = [],
    t = new Set();
  for (let r of e) {
    if (!V0(r)) {
      n.push(r);
      continue;
    }
    let o = n.find((i) => r.value.routeConfig === i.value.routeConfig);
    o !== void 0 ? (o.children.push(...r.children), t.add(o)) : n.push(r);
  }
  for (let r of t) {
    let o = jv(r.children);
    n.push(new We(r.value, o));
  }
  return n.filter((r) => !t.has(r));
}
function dv(e) {
  return e.data || {};
}
function fv(e) {
  return e.resolve || {};
}
function U0(e, n, t, r, o, i) {
  return he((s) =>
    F0(e, n, t, r, s.extractedUrl, o, i).pipe(
      A(({ state: a, tree: c }) => J(C({}, s), { targetSnapshot: a, urlAfterRedirects: c })),
    ),
  );
}
function $0(e, n) {
  return he((t) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: o },
    } = t;
    if (!o.length) return S(t);
    let i = new Set(o.map((c) => c.route)),
      s = new Set();
    for (let c of i) if (!s.has(c)) for (let l of Bv(c)) s.add(l);
    let a = 0;
    return ue(s).pipe(
      ft((c) => (i.has(c) ? H0(c, r, e, n) : ((c.data = Ha(c, c.parent, e).resolve), S(void 0)))),
      Ce(() => a++),
      fr(1),
      he((c) => (a === s.size ? S(t) : Re)),
    );
  });
}
function Bv(e) {
  let n = e.children.map((t) => Bv(t)).flat();
  return [e, ...n];
}
function H0(e, n, t, r) {
  let o = e.routeConfig,
    i = e._resolve;
  return (
    o?.title !== void 0 && !Nv(o) && (i[bi] = o.title),
    tn(
      () => (
        (e.data = Ha(e, e.parent, t).resolve),
        z0(i, e, n, r).pipe(A((s) => ((e._resolvedData = s), (e.data = C(C({}, e.data), s)), null)))
      ),
    )
  );
}
function z0(e, n, t, r) {
  let o = Ud(e);
  if (o.length === 0) return S({});
  let i = {};
  return ue(o).pipe(
    he((s) =>
      G0(e[s], n, t, r).pipe(
        Ot(),
        Ce((a) => {
          if (a instanceof Ei) throw Ga(new Zr(), a);
          i[s] = a;
        }),
      ),
    ),
    fr(1),
    A(() => i),
    nn((s) => (Pv(s) ? Re : dr(s))),
  );
}
function G0(e, n, t, r) {
  let o = Xr(n) ?? r,
    i = eo(e, o),
    s = i.resolve ? i.resolve(n, t) : Ie(o, () => i(n, t));
  return Kt(s);
}
function Bd(e) {
  return ge((n) => {
    let t = e(n);
    return t ? ue(t).pipe(A(() => n)) : S(n);
  });
}
var Vv = (() => {
    class e {
      buildTitle(t) {
        let r,
          o = t.root;
        for (; o !== void 0; )
          ((r = this.getResolvedTitleForRoute(o) ?? r),
            (o = o.children.find((i) => i.outlet === L)));
        return r;
      }
      getResolvedTitleForRoute(t) {
        return t.data[bi];
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: () => h(W0), providedIn: 'root' });
    }
    return e;
  })(),
  W0 = (() => {
    class e extends Vv {
      title;
      constructor(t) {
        (super(), (this.title = t));
      }
      updateTitle(t) {
        let r = this.buildTitle(t);
        r !== void 0 && this.title.setTitle(r);
      }
      static ɵfac = function (r) {
        return new (r || e)(M(ov));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  Qa = new T('', { providedIn: 'root', factory: () => ({}) }),
  Ka = new T(''),
  Uv = (() => {
    class e {
      componentLoaders = new WeakMap();
      childrenLoaders = new WeakMap();
      onLoadStartListener;
      onLoadEndListener;
      compiler = h(nd);
      loadComponent(t, r) {
        if (this.componentLoaders.get(r)) return this.componentLoaders.get(r);
        if (r._loadedComponent) return S(r._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(r);
        let o = Kt(Ie(t, () => r.loadComponent())).pipe(
            A($v),
            ge(Hv),
            Ce((s) => {
              (this.onLoadEndListener && this.onLoadEndListener(r), (r._loadedComponent = s));
            }),
            on(() => {
              this.componentLoaders.delete(r);
            }),
          ),
          i = new ur(o, () => new X()).pipe(lr());
        return (this.componentLoaders.set(r, i), i);
      }
      loadChildren(t, r) {
        if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
        if (r._loadedRoutes) return S({ routes: r._loadedRoutes, injector: r._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(r);
        let i = q0(r, this.compiler, t, this.onLoadEndListener).pipe(
            on(() => {
              this.childrenLoaders.delete(r);
            }),
          ),
          s = new ur(i, () => new X()).pipe(lr());
        return (this.childrenLoaders.set(r, s), s);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
function q0(e, n, t, r) {
  return Kt(Ie(t, () => e.loadChildren())).pipe(
    A($v),
    ge(Hv),
    he((o) => (o instanceof fa || Array.isArray(o) ? S(o) : ue(n.compileModuleAsync(o)))),
    A((o) => {
      r && r(e);
      let i,
        s,
        a = !1;
      return (
        Array.isArray(o)
          ? ((s = o), (a = !0))
          : ((i = o.create(t).injector), (s = i.get(Ka, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(hf), injector: i }
      );
    }),
  );
}
function Z0(e) {
  return e && typeof e == 'object' && 'default' in e;
}
function $v(e) {
  return Z0(e) ? e.default : e;
}
function Hv(e) {
  return S(e);
}
var gf = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: () => h(Y0), providedIn: 'root' });
    }
    return e;
  })(),
  Y0 = (() => {
    class e {
      shouldProcessUrl(t) {
        return !0;
      }
      extract(t) {
        return t;
      }
      merge(t, r) {
        return t;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  zv = new T('');
var Gv = new T(''),
  Wv = (() => {
    class e {
      currentNavigation = Un(null, { equal: () => !1 });
      currentTransition = null;
      lastSuccessfulNavigation = null;
      events = new X();
      transitionAbortWithErrorSubject = new X();
      configLoader = h(Uv);
      environmentInjector = h(me);
      destroyRef = h(hn);
      urlSerializer = h(qa);
      rootContexts = h(Ii);
      location = h(kr);
      inputBindingEnabled = h(Za, { optional: !0 }) !== null;
      titleStrategy = h(Vv);
      options = h(Qa, { optional: !0 }) || {};
      paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || 'emptyOnly';
      urlHandlingStrategy = h(gf);
      createViewTransition = h(zv, { optional: !0 });
      navigationErrorHandler = h(Gv, { optional: !0 });
      navigationId = 0;
      get hasRequestedNavigation() {
        return this.navigationId !== 0;
      }
      transitions;
      afterPreactivation = () => S(void 0);
      rootComponentType = null;
      destroyed = !1;
      constructor() {
        let t = (o) => this.events.next(new Yd(o)),
          r = (o) => this.events.next(new Qd(o));
        ((this.configLoader.onLoadEndListener = r),
          (this.configLoader.onLoadStartListener = t),
          this.destroyRef.onDestroy(() => {
            this.destroyed = !0;
          }));
      }
      complete() {
        this.transitions?.complete();
      }
      handleNavigationRequest(t) {
        let r = ++this.navigationId;
        Gt(() => {
          this.transitions?.next(
            J(C({}, t), {
              extractedUrl: this.urlHandlingStrategy.extract(t.rawUrl),
              targetSnapshot: null,
              targetRouterState: null,
              guards: { canActivateChecks: [], canDeactivateChecks: [] },
              guardsResult: null,
              abortController: new AbortController(),
              id: r,
            }),
          );
        });
      }
      setupNavigations(t) {
        return (
          (this.transitions = new pe(null)),
          this.transitions.pipe(
            Oe((r) => r !== null),
            ge((r) => {
              let o = !1;
              return S(r).pipe(
                ge((i) => {
                  if (this.navigationId > r.id)
                    return (
                      this.cancelNavigationTransition(r, '', Fe.SupersededByNewNavigation),
                      Re
                    );
                  ((this.currentTransition = r),
                    this.currentNavigation.set({
                      id: i.id,
                      initialUrl: i.rawUrl,
                      extractedUrl: i.extractedUrl,
                      targetBrowserUrl:
                        typeof i.extras.browserUrl == 'string'
                          ? this.urlSerializer.parse(i.extras.browserUrl)
                          : i.extras.browserUrl,
                      trigger: i.source,
                      extras: i.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? J(C({}, this.lastSuccessfulNavigation), { previousNavigation: null })
                        : null,
                      abort: () => i.abortController.abort(),
                    }));
                  let s =
                      !t.navigated || this.isUpdatingInternalState() || this.isUpdatedBrowserUrl(),
                    a = i.extras.onSameUrlNavigation ?? t.onSameUrlNavigation;
                  if (!s && a !== 'reload')
                    return (
                      this.events.next(
                        new Dn(
                          i.id,
                          this.urlSerializer.serialize(i.rawUrl),
                          '',
                          Ba.IgnoredSameUrlNavigation,
                        ),
                      ),
                      i.resolve(!1),
                      Re
                    );
                  if (this.urlHandlingStrategy.shouldProcessUrl(i.rawUrl))
                    return S(i).pipe(
                      ge(
                        (c) => (
                          this.events.next(
                            new Qr(
                              c.id,
                              this.urlSerializer.serialize(c.extractedUrl),
                              c.source,
                              c.restoredState,
                            ),
                          ),
                          c.id !== this.navigationId ? Re : Promise.resolve(c)
                        ),
                      ),
                      U0(
                        this.environmentInjector,
                        this.configLoader,
                        this.rootComponentType,
                        t.config,
                        this.urlSerializer,
                        this.paramsInheritanceStrategy,
                      ),
                      Ce((c) => {
                        ((r.targetSnapshot = c.targetSnapshot),
                          (r.urlAfterRedirects = c.urlAfterRedirects),
                          this.currentNavigation.update(
                            (u) => ((u.finalUrl = c.urlAfterRedirects), u),
                          ));
                        let l = new Va(
                          c.id,
                          this.urlSerializer.serialize(c.extractedUrl),
                          this.urlSerializer.serialize(c.urlAfterRedirects),
                          c.targetSnapshot,
                        );
                        this.events.next(l);
                      }),
                    );
                  if (s && this.urlHandlingStrategy.shouldProcessUrl(i.currentRawUrl)) {
                    let { id: c, extractedUrl: l, source: u, restoredState: d, extras: p } = i,
                      f = new Qr(c, this.urlSerializer.serialize(l), u, d);
                    this.events.next(f);
                    let m = Sv(this.rootComponentType).snapshot;
                    return (
                      (this.currentTransition = r =
                        J(C({}, i), {
                          targetSnapshot: m,
                          urlAfterRedirects: l,
                          extras: J(C({}, p), { skipLocationChange: !1, replaceUrl: !1 }),
                        })),
                      this.currentNavigation.update((_) => ((_.finalUrl = l), _)),
                      S(r)
                    );
                  } else
                    return (
                      this.events.next(
                        new Dn(
                          i.id,
                          this.urlSerializer.serialize(i.extractedUrl),
                          '',
                          Ba.IgnoredByUrlHandlingStrategy,
                        ),
                      ),
                      i.resolve(!1),
                      Re
                    );
                }),
                Ce((i) => {
                  let s = new Gd(
                    i.id,
                    this.urlSerializer.serialize(i.extractedUrl),
                    this.urlSerializer.serialize(i.urlAfterRedirects),
                    i.targetSnapshot,
                  );
                  this.events.next(s);
                }),
                A(
                  (i) => (
                    (this.currentTransition = r =
                      J(C({}, i), {
                        guards: s0(i.targetSnapshot, i.currentSnapshot, this.rootContexts),
                      })),
                    r
                  ),
                ),
                v0(this.environmentInjector, (i) => this.events.next(i)),
                Ce((i) => {
                  if (
                    ((r.guardsResult = i.guardsResult),
                    i.guardsResult && typeof i.guardsResult != 'boolean')
                  )
                    throw Ga(this.urlSerializer, i.guardsResult);
                  let s = new Wd(
                    i.id,
                    this.urlSerializer.serialize(i.extractedUrl),
                    this.urlSerializer.serialize(i.urlAfterRedirects),
                    i.targetSnapshot,
                    !!i.guardsResult,
                  );
                  this.events.next(s);
                }),
                Oe((i) =>
                  i.guardsResult
                    ? !0
                    : (this.cancelNavigationTransition(i, '', Fe.GuardRejected), !1),
                ),
                Bd((i) => {
                  if (i.guards.canActivateChecks.length !== 0)
                    return S(i).pipe(
                      Ce((s) => {
                        let a = new qd(
                          s.id,
                          this.urlSerializer.serialize(s.extractedUrl),
                          this.urlSerializer.serialize(s.urlAfterRedirects),
                          s.targetSnapshot,
                        );
                        this.events.next(a);
                      }),
                      ge((s) => {
                        let a = !1;
                        return S(s).pipe(
                          $0(this.paramsInheritanceStrategy, this.environmentInjector),
                          Ce({
                            next: () => (a = !0),
                            complete: () => {
                              a || this.cancelNavigationTransition(s, '', Fe.NoDataFromResolver);
                            },
                          }),
                        );
                      }),
                      Ce((s) => {
                        let a = new Zd(
                          s.id,
                          this.urlSerializer.serialize(s.extractedUrl),
                          this.urlSerializer.serialize(s.urlAfterRedirects),
                          s.targetSnapshot,
                        );
                        this.events.next(a);
                      }),
                    );
                }),
                Bd((i) => {
                  let s = (a) => {
                    let c = [];
                    if (a.routeConfig?.loadComponent) {
                      let l = Xr(a) ?? this.environmentInjector;
                      c.push(
                        this.configLoader.loadComponent(l, a.routeConfig).pipe(
                          Ce((u) => {
                            a.component = u;
                          }),
                          A(() => {}),
                        ),
                      );
                    }
                    for (let l of a.children) c.push(...s(l));
                    return c;
                  };
                  return ns(s(i.targetSnapshot.root)).pipe(rn(null), ke(1));
                }),
                Bd(() => this.afterPreactivation()),
                ge(() => {
                  let { currentSnapshot: i, targetSnapshot: s } = r,
                    a = this.createViewTransition?.(this.environmentInjector, i.root, s.root);
                  return a ? ue(a).pipe(A(() => r)) : S(r);
                }),
                A((i) => {
                  let s = t0(t.routeReuseStrategy, i.targetSnapshot, i.currentRouterState);
                  return (
                    (this.currentTransition = r = J(C({}, i), { targetRouterState: s })),
                    this.currentNavigation.update((a) => ((a.targetRouterState = s), a)),
                    r
                  );
                }),
                Ce(() => {
                  this.events.next(new vi());
                }),
                i0(
                  this.rootContexts,
                  t.routeReuseStrategy,
                  (i) => this.events.next(i),
                  this.inputBindingEnabled,
                ),
                ke(1),
                is(
                  new F((i) => {
                    let s = r.abortController.signal,
                      a = () => i.next();
                    return (
                      s.addEventListener('abort', a),
                      () => s.removeEventListener('abort', a)
                    );
                  }).pipe(
                    Oe(() => !o && !r.targetRouterState),
                    Ce(() => {
                      this.cancelNavigationTransition(
                        r,
                        r.abortController.signal.reason + '',
                        Fe.Aborted,
                      );
                    }),
                  ),
                ),
                Ce({
                  next: (i) => {
                    ((o = !0),
                      (this.lastSuccessfulNavigation = Gt(this.currentNavigation)),
                      this.events.next(
                        new En(
                          i.id,
                          this.urlSerializer.serialize(i.extractedUrl),
                          this.urlSerializer.serialize(i.urlAfterRedirects),
                        ),
                      ),
                      this.titleStrategy?.updateTitle(i.targetRouterState.snapshot),
                      i.resolve(!0));
                  },
                  complete: () => {
                    o = !0;
                  },
                }),
                is(
                  this.transitionAbortWithErrorSubject.pipe(
                    Ce((i) => {
                      throw i;
                    }),
                  ),
                ),
                on(() => {
                  (o || this.cancelNavigationTransition(r, '', Fe.SupersededByNewNavigation),
                    this.currentTransition?.id === r.id &&
                      (this.currentNavigation.set(null), (this.currentTransition = null)));
                }),
                nn((i) => {
                  if (this.destroyed) return (r.resolve(!1), Re);
                  if (((o = !0), kv(i)))
                    (this.events.next(
                      new Yt(
                        r.id,
                        this.urlSerializer.serialize(r.extractedUrl),
                        i.message,
                        i.cancellationCode,
                      ),
                    ),
                      o0(i)
                        ? this.events.next(new Kr(i.url, i.navigationBehaviorOptions))
                        : r.resolve(!1));
                  else {
                    let s = new mi(
                      r.id,
                      this.urlSerializer.serialize(r.extractedUrl),
                      i,
                      r.targetSnapshot ?? void 0,
                    );
                    try {
                      let a = Ie(this.environmentInjector, () => this.navigationErrorHandler?.(s));
                      if (a instanceof Ei) {
                        let { message: c, cancellationCode: l } = Ga(this.urlSerializer, a);
                        (this.events.next(
                          new Yt(r.id, this.urlSerializer.serialize(r.extractedUrl), c, l),
                        ),
                          this.events.next(new Kr(a.redirectTo, a.navigationBehaviorOptions)));
                      } else throw (this.events.next(s), i);
                    } catch (a) {
                      this.options.resolveNavigationPromiseOnError ? r.resolve(!1) : r.reject(a);
                    }
                  }
                  return Re;
                }),
              );
            }),
          )
        );
      }
      cancelNavigationTransition(t, r, o) {
        let i = new Yt(t.id, this.urlSerializer.serialize(t.extractedUrl), r, o);
        (this.events.next(i), t.resolve(!1));
      }
      isUpdatingInternalState() {
        return (
          this.currentTransition?.extractedUrl.toString() !==
          this.currentTransition?.currentUrlTree.toString()
        );
      }
      isUpdatedBrowserUrl() {
        let t = this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(!0))),
          r = Gt(this.currentNavigation),
          o = r?.targetBrowserUrl ?? r?.extractedUrl;
        return t.toString() !== o?.toString() && !r?.extras.skipLocationChange;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
function Q0(e) {
  return e !== pi;
}
var K0 = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: () => h(J0), providedIn: 'root' });
    }
    return e;
  })(),
  ff = class {
    shouldDetach(n) {
      return !1;
    }
    store(n, t) {}
    shouldAttach(n) {
      return !1;
    }
    retrieve(n) {
      return null;
    }
    shouldReuseRoute(n, t) {
      return n.routeConfig === t.routeConfig;
    }
  },
  J0 = (() => {
    class e extends ff {
      static ɵfac = (() => {
        let t;
        return function (o) {
          return (t || (t = mn(e)))(o || e);
        };
      })();
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  qv = (() => {
    class e {
      urlSerializer = h(qa);
      options = h(Qa, { optional: !0 }) || {};
      canceledNavigationResolution = this.options.canceledNavigationResolution || 'replace';
      location = h(kr);
      urlHandlingStrategy = h(gf);
      urlUpdateStrategy = this.options.urlUpdateStrategy || 'deferred';
      currentUrlTree = new Qt();
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      rawUrlTree = this.currentUrlTree;
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      createBrowserPath({ finalUrl: t, initialUrl: r, targetBrowserUrl: o }) {
        let i = t !== void 0 ? this.urlHandlingStrategy.merge(t, r) : r,
          s = o ?? i;
        return s instanceof Qt ? this.urlSerializer.serialize(s) : s;
      }
      commitTransition({ targetRouterState: t, finalUrl: r, initialUrl: o }) {
        r && t
          ? ((this.currentUrlTree = r),
            (this.rawUrlTree = this.urlHandlingStrategy.merge(r, o)),
            (this.routerState = t))
          : (this.rawUrlTree = o);
      }
      routerState = Sv(null);
      getRouterState() {
        return this.routerState;
      }
      stateMemento = this.createStateMemento();
      updateStateMemento() {
        this.stateMemento = this.createStateMemento();
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      resetInternalState({ finalUrl: t }) {
        ((this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            t ?? this.rawUrlTree,
          )));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: () => h(X0), providedIn: 'root' });
    }
    return e;
  })(),
  X0 = (() => {
    class e extends qv {
      currentPageId = 0;
      lastSuccessfulId = -1;
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== 'computed'
          ? this.currentPageId
          : (this.restoredState()?.ɵrouterPageId ?? this.currentPageId);
      }
      registerNonRouterCurrentEntryChangeListener(t) {
        return this.location.subscribe((r) => {
          r.type === 'popstate' &&
            setTimeout(() => {
              t(r.url, r.state, 'popstate');
            });
        });
      }
      handleRouterEvent(t, r) {
        t instanceof Qr
          ? this.updateStateMemento()
          : t instanceof Dn
            ? this.commitTransition(r)
            : t instanceof Va
              ? this.urlUpdateStrategy === 'eager' &&
                (r.extras.skipLocationChange || this.setBrowserUrl(this.createBrowserPath(r), r))
              : t instanceof vi
                ? (this.commitTransition(r),
                  this.urlUpdateStrategy === 'deferred' &&
                    !r.extras.skipLocationChange &&
                    this.setBrowserUrl(this.createBrowserPath(r), r))
                : t instanceof Yt &&
                    t.code !== Fe.SupersededByNewNavigation &&
                    t.code !== Fe.Redirect
                  ? this.restoreHistory(r)
                  : t instanceof mi
                    ? this.restoreHistory(r, !0)
                    : t instanceof En &&
                      ((this.lastSuccessfulId = t.id), (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(t, { extras: r, id: o }) {
        let { replaceUrl: i, state: s } = r;
        if (this.location.isCurrentPathEqualTo(t) || i) {
          let a = this.browserPageId,
            c = C(C({}, s), this.generateNgRouterState(o, a));
          this.location.replaceState(t, '', c);
        } else {
          let a = C(C({}, s), this.generateNgRouterState(o, this.browserPageId + 1));
          this.location.go(t, '', a);
        }
      }
      restoreHistory(t, r = !1) {
        if (this.canceledNavigationResolution === 'computed') {
          let o = this.browserPageId,
            i = this.currentPageId - o;
          i !== 0
            ? this.location.historyGo(i)
            : this.getCurrentUrlTree() === t.finalUrl &&
              i === 0 &&
              (this.resetInternalState(t), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === 'replace' &&
            (r && this.resetInternalState(t), this.resetUrlToCurrentUrlTree());
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.getRawUrlTree()),
          '',
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
        );
      }
      generateNgRouterState(t, r) {
        return this.canceledNavigationResolution === 'computed'
          ? { navigationId: t, ɵrouterPageId: r }
          : { navigationId: t };
      }
      static ɵfac = (() => {
        let t;
        return function (o) {
          return (t || (t = mn(e)))(o || e);
        };
      })();
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
function Zv(e, n) {
  e.events
    .pipe(
      Oe((t) => t instanceof En || t instanceof Yt || t instanceof mi || t instanceof Dn),
      A((t) =>
        t instanceof En || t instanceof Dn
          ? 0
          : (
                t instanceof Yt
                  ? t.code === Fe.Redirect || t.code === Fe.SupersededByNewNavigation
                  : !1
              )
            ? 2
            : 1,
      ),
      Oe((t) => t !== 2),
      ke(1),
    )
    .subscribe(() => {
      n();
    });
}
var e_ = { paths: 'exact', fragment: 'ignored', matrixParams: 'ignored', queryParams: 'exact' },
  t_ = { paths: 'subset', fragment: 'ignored', matrixParams: 'ignored', queryParams: 'subset' },
  mf = (() => {
    class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      disposed = !1;
      nonRouterCurrentEntryChangeSubscription;
      console = h(pa);
      stateManager = h(qv);
      options = h(Qa, { optional: !0 }) || {};
      pendingTasks = h(Et);
      urlUpdateStrategy = this.options.urlUpdateStrategy || 'deferred';
      navigationTransitions = h(Wv);
      urlSerializer = h(qa);
      location = h(kr);
      urlHandlingStrategy = h(gf);
      injector = h(me);
      _events = new X();
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      navigated = !1;
      routeReuseStrategy = h(K0);
      onSameUrlNavigation = this.options.onSameUrlNavigation || 'ignore';
      config = h(Ka, { optional: !0 })?.flat() ?? [];
      componentInputBindingEnabled = !!h(Za, { optional: !0 });
      currentNavigation = this.navigationTransitions.currentNavigation.asReadonly();
      constructor() {
        (this.resetConfig(this.config),
          this.navigationTransitions.setupNavigations(this).subscribe({
            error: (t) => {
              this.console.warn(t);
            },
          }),
          this.subscribeToNavigationEvents());
      }
      eventsSubscription = new le();
      subscribeToNavigationEvents() {
        let t = this.navigationTransitions.events.subscribe((r) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              i = Gt(this.navigationTransitions.currentNavigation);
            if (o !== null && i !== null) {
              if (
                (this.stateManager.handleRouterEvent(r, i),
                r instanceof Yt &&
                  r.code !== Fe.Redirect &&
                  r.code !== Fe.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (r instanceof En) this.navigated = !0;
              else if (r instanceof Kr) {
                let s = r.navigationBehaviorOptions,
                  a = this.urlHandlingStrategy.merge(r.url, o.currentRawUrl),
                  c = C(
                    {
                      browserUrl: o.extras.browserUrl,
                      info: o.extras.info,
                      skipLocationChange: o.extras.skipLocationChange,
                      replaceUrl:
                        o.extras.replaceUrl || this.urlUpdateStrategy === 'eager' || Q0(o.source),
                    },
                    s,
                  );
                this.scheduleNavigation(a, pi, null, c, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            Qw(r) && this._events.next(r);
          } catch (o) {
            this.navigationTransitions.transitionAbortWithErrorSubject.next(o);
          }
        });
        this.eventsSubscription.add(t);
      }
      resetRootComponentType(t) {
        ((this.routerState.root.component = t), (this.navigationTransitions.rootComponentType = t));
      }
      initialNavigation() {
        (this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              pi,
              this.stateManager.restoredState(),
            ));
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener((t, r, o) => {
            this.navigateToSyncWithBrowser(t, o, r);
          });
      }
      navigateToSyncWithBrowser(t, r, o) {
        let i = { replaceUrl: !0 },
          s = o?.navigationId ? o : null;
        if (o) {
          let c = C({}, o);
          (delete c.navigationId,
            delete c.ɵrouterPageId,
            Object.keys(c).length !== 0 && (i.state = c));
        }
        let a = this.parseUrl(t);
        this.scheduleNavigation(a, r, s, i).catch((c) => {
          this.disposed || this.injector.get(ze)(c);
        });
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return Gt(this.navigationTransitions.currentNavigation);
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(t) {
        ((this.config = t.map(hf)), (this.navigated = !1));
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        (this._events.unsubscribe(),
          this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe());
      }
      createUrlTree(t, r = {}) {
        let {
            relativeTo: o,
            queryParams: i,
            fragment: s,
            queryParamsHandling: a,
            preserveFragment: c,
          } = r,
          l = c ? this.currentUrlTree.fragment : s,
          u = null;
        switch (a ?? this.options.defaultQueryParamsHandling) {
          case 'merge':
            u = C(C({}, this.currentUrlTree.queryParams), i);
            break;
          case 'preserve':
            u = this.currentUrlTree.queryParams;
            break;
          default:
            u = i || null;
        }
        u !== null && (u = this.removeEmptyProps(u));
        let d;
        try {
          let p = o ? o.snapshot : this.routerState.snapshot.root;
          d = Iv(p);
        } catch {
          ((typeof t[0] != 'string' || t[0][0] !== '/') && (t = []),
            (d = this.currentUrlTree.root));
        }
        return wv(d, t, u, l ?? null);
      }
      navigateByUrl(t, r = { skipLocationChange: !1 }) {
        let o = Yr(t) ? t : this.parseUrl(t),
          i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(i, pi, null, r);
      }
      navigate(t, r = { skipLocationChange: !1 }) {
        return (n_(t), this.navigateByUrl(this.createUrlTree(t, r), r));
      }
      serializeUrl(t) {
        return this.urlSerializer.serialize(t);
      }
      parseUrl(t) {
        try {
          return this.urlSerializer.parse(t);
        } catch {
          return this.urlSerializer.parse('/');
        }
      }
      isActive(t, r) {
        let o;
        if ((r === !0 ? (o = C({}, e_)) : r === !1 ? (o = C({}, t_)) : (o = r), Yr(t)))
          return sv(this.currentUrlTree, t, o);
        let i = this.parseUrl(t);
        return sv(this.currentUrlTree, i, o);
      }
      removeEmptyProps(t) {
        return Object.entries(t).reduce((r, [o, i]) => (i != null && (r[o] = i), r), {});
      }
      scheduleNavigation(t, r, o, i, s) {
        if (this.disposed) return Promise.resolve(!1);
        let a, c, l;
        s
          ? ((a = s.resolve), (c = s.reject), (l = s.promise))
          : (l = new Promise((d, p) => {
              ((a = d), (c = p));
            }));
        let u = this.pendingTasks.add();
        return (
          Zv(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(u));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: r,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: t,
            extras: i,
            resolve: a,
            reject: c,
            promise: l,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          l.catch((d) => Promise.reject(d))
        );
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
function n_(e) {
  for (let n = 0; n < e.length; n++) if (e[n] == null) throw new b(4008, !1);
}
var r_ = new T('');
function vf(e, ...n) {
  return On([
    { provide: Ka, multi: !0, useValue: e },
    [],
    { provide: er, useFactory: o_, deps: [mf] },
    { provide: ha, multi: !0, useFactory: i_ },
    n.map((t) => t.ɵproviders),
  ]);
}
function o_(e) {
  return e.routerState.root;
}
function i_() {
  let e = h(nt);
  return (n) => {
    let t = e.get(vn);
    if (n !== t.components[0]) return;
    let r = e.get(mf),
      o = e.get(s_);
    (e.get(a_) === 1 && r.initialNavigation(),
      e.get(c_, null, { optional: !0 })?.setUpPreloading(),
      e.get(r_, null, { optional: !0 })?.init(),
      r.resetRootComponentType(t.componentTypes[0]),
      o.closed || (o.next(), o.complete(), o.unsubscribe()));
  };
}
var s_ = new T('', { factory: () => new X() }),
  a_ = new T('', { providedIn: 'root', factory: () => 1 });
var c_ = new T('');
var Yv = [];
var Si = class {},
  u_ = (() => {
    class e {
      handle(t) {
        return t.key;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  to = class {},
  d_ = (() => {
    class e extends to {
      compile(t, r) {
        return t;
      }
      compileTranslations(t, r) {
        return t;
      }
      static ɵfac = (() => {
        let t;
        return function (o) {
          return (t || (t = mn(e)))(o || e);
        };
      })();
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  bn = class {},
  f_ = (() => {
    class e extends bn {
      getTranslation(t) {
        return S({});
      }
      static ɵfac = (() => {
        let t;
        return function (o) {
          return (t || (t = mn(e)))(o || e);
        };
      })();
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })();
function Ja(e, n) {
  if (e === n) return !0;
  if (e === null || n === null) return !1;
  if (e !== e && n !== n) return !0;
  let t = typeof e,
    r = typeof n,
    o;
  if (t == r && t == 'object')
    if (Array.isArray(e)) {
      if (!Array.isArray(n)) return !1;
      if ((o = e.length) == n.length) {
        for (let i = 0; i < o; i++) if (!Ja(e[i], n[i])) return !1;
        return !0;
      }
    } else {
      if (Array.isArray(n)) return !1;
      if (Jt(e) && Jt(n)) {
        let i = Object.create(null);
        for (let s in e) {
          if (!Ja(e[s], n[s])) return !1;
          i[s] = !0;
        }
        for (let s in n) if (!(s in i) && typeof n[s] < 'u') return !1;
        return !0;
      }
    }
  return !1;
}
function Cn(e) {
  return typeof e < 'u' && e !== null;
}
function Qv(e) {
  return e !== void 0;
}
function Jt(e) {
  return Ti(e) && !tr(e) && e !== null;
}
function Ti(e) {
  return typeof e == 'object' && e !== null;
}
function tr(e) {
  return Array.isArray(e);
}
function Xa(e) {
  return typeof e == 'string';
}
function p_(e) {
  return typeof e == 'function';
}
function ec(e) {
  if (tr(e)) return e.map((n) => ec(n));
  if (Jt(e)) {
    let n = {};
    return (
      Object.keys(e).forEach((t) => {
        n[t] = ec(e[t]);
      }),
      n
    );
  } else return e;
}
function Df(e, n) {
  if (!Ti(e)) return ec(n);
  let t = ec(e);
  return (
    Ti(t) &&
      Ti(n) &&
      Object.keys(n).forEach((r) => {
        Jt(n[r])
          ? r in e
            ? (t[r] = Df(e[r], n[r]))
            : Object.assign(t, { [r]: n[r] })
          : Object.assign(t, { [r]: n[r] });
      }),
    t
  );
}
function Jv(e, n) {
  let t = n.split('.');
  n = '';
  do {
    n += t.shift();
    let r = !t.length;
    if (Cn(e)) {
      if (Jt(e) && Qv(e[n]) && (Jt(e[n]) || tr(e[n]) || r)) {
        ((e = e[n]), (n = ''));
        continue;
      }
      if (tr(e)) {
        let o = parseInt(n, 10);
        if (Qv(e[o]) && (Jt(e[o]) || tr(e[o]) || r)) {
          ((e = e[o]), (n = ''));
          continue;
        }
      }
    }
    if (r) {
      e = void 0;
      continue;
    }
    n += '.';
  } while (t.length);
  return e;
}
function h_(e, n, t) {
  return Df(e, g_(n, t));
}
function g_(e, n) {
  return e.split('.').reduceRight((t, r) => ({ [r]: t }), n);
}
var no = class {},
  m_ = (() => {
    class e extends no {
      templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
      interpolate(t, r) {
        if (Xa(t)) return this.interpolateString(t, r);
        if (p_(t)) return this.interpolateFunction(t, r);
      }
      interpolateFunction(t, r) {
        return t(r);
      }
      interpolateString(t, r) {
        return r
          ? t.replace(this.templateMatcher, (o, i) => {
              let s = this.getInterpolationReplacement(r, i);
              return s !== void 0 ? s : o;
            })
          : t;
      }
      getInterpolationReplacement(t, r) {
        return this.formatValue(Jv(t, r));
      }
      formatValue(t) {
        if (Xa(t)) return t;
        if (typeof t == 'number' || typeof t == 'boolean') return t.toString();
        if (t === null) return 'null';
        if (tr(t)) return t.join(', ');
        if (Ti(t))
          return typeof t.toString == 'function' && t.toString !== Object.prototype.toString
            ? t.toString()
            : JSON.stringify(t);
      }
      static ɵfac = (() => {
        let t;
        return function (o) {
          return (t || (t = mn(e)))(o || e);
        };
      })();
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  yf = (() => {
    class e {
      _onTranslationChange = new X();
      _onLangChange = new X();
      _onFallbackLangChange = new X();
      fallbackLang = null;
      currentLang;
      translations = {};
      languages = [];
      getTranslations(t) {
        return this.translations[t];
      }
      setTranslations(t, r, o) {
        ((this.translations[t] = o && this.hasTranslationFor(t) ? Df(this.translations[t], r) : r),
          this.addLanguages([t]),
          this._onTranslationChange.next({ lang: t, translations: this.getTranslations(t) }));
      }
      getLanguages() {
        return this.languages;
      }
      getCurrentLang() {
        return this.currentLang;
      }
      getFallbackLang() {
        return this.fallbackLang;
      }
      setFallbackLang(t, r = !0) {
        ((this.fallbackLang = t),
          r && this._onFallbackLangChange.next({ lang: t, translations: this.translations[t] }));
      }
      setCurrentLang(t, r = !0) {
        ((this.currentLang = t),
          r && this._onLangChange.next({ lang: t, translations: this.translations[t] }));
      }
      get onTranslationChange() {
        return this._onTranslationChange.asObservable();
      }
      get onLangChange() {
        return this._onLangChange.asObservable();
      }
      get onFallbackLangChange() {
        return this._onFallbackLangChange.asObservable();
      }
      addLanguages(t) {
        this.languages = Array.from(new Set([...this.languages, ...t]));
      }
      hasTranslationFor(t) {
        return typeof this.translations[t] < 'u';
      }
      deleteTranslations(t) {
        delete this.translations[t];
      }
      getTranslation(t) {
        let r = this.getValue(this.currentLang, t);
        return (
          r === void 0 &&
            this.fallbackLang != null &&
            this.fallbackLang !== this.currentLang &&
            (r = this.getValue(this.fallbackLang, t)),
          r
        );
      }
      getValue(t, r) {
        return Jv(this.getTranslations(t), r);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Ef = new T('TRANSLATE_CONFIG'),
  _i = (e) => (dt(e) ? e : S(e));
var Xt = (() => {
  class e {
    loadingTranslations;
    pending = !1;
    _translationRequests = {};
    lastUseLanguage = null;
    currentLoader = h(bn);
    compiler = h(to);
    parser = h(no);
    missingTranslationHandler = h(Si);
    store = h(yf);
    extend = !1;
    get onTranslationChange() {
      return this.store.onTranslationChange;
    }
    get onLangChange() {
      return this.store.onLangChange;
    }
    get onFallbackLangChange() {
      return this.store.onFallbackLangChange;
    }
    get onDefaultLangChange() {
      return this.store.onFallbackLangChange;
    }
    constructor() {
      let t = C({ extend: !1, fallbackLang: null }, h(Ef, { optional: !0 }));
      (t.lang && this.use(t.lang),
        t.fallbackLang && this.setFallbackLang(t.fallbackLang),
        t.extend && (this.extend = !0));
    }
    setFallbackLang(t) {
      this.getFallbackLang() || this.store.setFallbackLang(t, !1);
      let r = this.loadOrExtendLanguage(t);
      return dt(r)
        ? (r.pipe(ke(1)).subscribe({
            next: () => {
              this.store.setFallbackLang(t);
            },
            error: () => {},
          }),
          r)
        : (this.store.setFallbackLang(t), S(this.store.getTranslations(t)));
    }
    use(t) {
      ((this.lastUseLanguage = t), this.getCurrentLang() || this.store.setCurrentLang(t, !1));
      let r = this.loadOrExtendLanguage(t);
      return dt(r)
        ? (r.pipe(ke(1)).subscribe({
            next: () => {
              this.changeLang(t);
            },
            error: () => {},
          }),
          r)
        : (this.changeLang(t), S(this.store.getTranslations(t)));
    }
    loadOrExtendLanguage(t) {
      if (!this.store.hasTranslationFor(t) || this.extend)
        return (
          (this._translationRequests[t] =
            this._translationRequests[t] || this.loadAndCompileTranslations(t)),
          this._translationRequests[t]
        );
    }
    changeLang(t) {
      t === this.lastUseLanguage && this.store.setCurrentLang(t);
    }
    getCurrentLang() {
      return this.store.getCurrentLang();
    }
    loadAndCompileTranslations(t) {
      this.pending = !0;
      let r = this.currentLoader.getTranslation(t).pipe(os(1), ke(1));
      return (
        (this.loadingTranslations = r.pipe(
          A((o) => this.compiler.compileTranslations(o, t)),
          os(1),
          ke(1),
        )),
        this.loadingTranslations.subscribe({
          next: (o) => {
            (this.store.setTranslations(t, o, this.extend), (this.pending = !1));
          },
          error: (o) => {
            this.pending = !1;
          },
        }),
        r
      );
    }
    setTranslation(t, r, o = !1) {
      let i = this.compiler.compileTranslations(r, t);
      this.store.setTranslations(t, i, o || this.extend);
    }
    getLangs() {
      return this.store.getLanguages();
    }
    addLangs(t) {
      this.store.addLanguages(t);
    }
    getParsedResultForKey(t, r) {
      let o = this.getTextToInterpolate(t);
      if (Cn(o)) return this.runInterpolation(o, r);
      let i = this.missingTranslationHandler.handle(
        C({ key: t, translateService: this }, r !== void 0 && { interpolateParams: r }),
      );
      return i !== void 0 ? i : t;
    }
    getFallbackLang() {
      return this.store.getFallbackLang();
    }
    getTextToInterpolate(t) {
      return this.store.getTranslation(t);
    }
    runInterpolation(t, r) {
      if (Cn(t))
        return tr(t)
          ? this.runInterpolationOnArray(t, r)
          : Jt(t)
            ? this.runInterpolationOnDict(t, r)
            : this.parser.interpolate(t, r);
    }
    runInterpolationOnArray(t, r) {
      return t.map((o) => this.runInterpolation(o, r));
    }
    runInterpolationOnDict(t, r) {
      let o = {};
      for (let i in t) {
        let s = this.runInterpolation(t[i], r);
        s !== void 0 && (o[i] = s);
      }
      return o;
    }
    getParsedResult(t, r) {
      return t instanceof Array
        ? this.getParsedResultForArray(t, r)
        : this.getParsedResultForKey(t, r);
    }
    getParsedResultForArray(t, r) {
      let o = {},
        i = !1;
      for (let a of t) ((o[a] = this.getParsedResultForKey(a, r)), (i = i || dt(o[a])));
      if (!i) return o;
      let s = t.map((a) => _i(o[a]));
      return Rc(s).pipe(
        A((a) => {
          let c = {};
          return (
            a.forEach((l, u) => {
              c[t[u]] = l;
            }),
            c
          );
        }),
      );
    }
    get(t, r) {
      if (!Cn(t) || !t.length) throw new Error('Parameter "key" is required and cannot be empty');
      return this.pending
        ? this.loadingTranslations.pipe(ft(() => _i(this.getParsedResult(t, r))))
        : _i(this.getParsedResult(t, r));
    }
    getStreamOnTranslationChange(t, r) {
      if (!Cn(t) || !t.length) throw new Error('Parameter "key" is required and cannot be empty');
      return At(
        tn(() => this.get(t, r)),
        this.onTranslationChange.pipe(
          ge(() => {
            let o = this.getParsedResult(t, r);
            return _i(o);
          }),
        ),
      );
    }
    stream(t, r) {
      if (!Cn(t) || !t.length) throw new Error('Parameter "key" required');
      return At(
        tn(() => this.get(t, r)),
        this.onLangChange.pipe(
          ge(() => {
            let o = this.getParsedResult(t, r);
            return _i(o);
          }),
        ),
      );
    }
    instant(t, r) {
      if (!Cn(t) || t.length === 0)
        throw new Error('Parameter "key" is required and cannot be empty');
      let o = this.getParsedResult(t, r);
      return dt(o) ? (Array.isArray(t) ? t.reduce((i, s) => ((i[s] = s), i), {}) : t) : o;
    }
    set(t, r, o = this.getCurrentLang()) {
      this.store.setTranslations(
        o,
        h_(
          this.store.getTranslations(o),
          t,
          Xa(r) ? this.compiler.compile(r, o) : this.compiler.compileTranslations(r, o),
        ),
        !1,
      );
    }
    reloadLang(t) {
      return (this.resetLang(t), this.loadAndCompileTranslations(t));
    }
    resetLang(t) {
      (delete this._translationRequests[t], this.store.deleteTranslations(t));
    }
    static getBrowserLang() {
      if (typeof window > 'u' || !window.navigator) return;
      let t = this.getBrowserCultureLang();
      return t ? t.split(/[-_]/)[0] : void 0;
    }
    static getBrowserCultureLang() {
      if (!(typeof window > 'u' || typeof window.navigator > 'u'))
        return window.navigator.languages
          ? window.navigator.languages[0]
          : window.navigator.language ||
              window.navigator.browserLanguage ||
              window.navigator.userLanguage;
    }
    getBrowserLang() {
      return e.getBrowserLang();
    }
    getBrowserCultureLang() {
      return e.getBrowserCultureLang();
    }
    get defaultLang() {
      return this.getFallbackLang();
    }
    get currentLang() {
      return this.store.getCurrentLang();
    }
    get langs() {
      return this.store.getLanguages();
    }
    setDefaultLang(t) {
      return this.setFallbackLang(t);
    }
    getDefaultLang() {
      return this.getFallbackLang();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = w({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var ro = (() => {
  class e {
    translate = h(Xt);
    _ref = h(Xo);
    value = '';
    lastKey = null;
    lastParams = [];
    onTranslationChange;
    onLangChange;
    onFallbackLangChange;
    updateValue(t, r, o) {
      let i = (s) => {
        ((this.value = s !== void 0 ? s : t), (this.lastKey = t), this._ref.markForCheck());
      };
      if (o) {
        let s = this.translate.getParsedResult(t, r);
        dt(s) ? s.subscribe(i) : i(s);
      }
      this.translate.get(t, r).subscribe(i);
    }
    transform(t, ...r) {
      if (!t || !t.length) return t;
      if (Ja(t, this.lastKey) && Ja(r, this.lastParams)) return this.value;
      let o;
      if (Cn(r[0]) && r.length)
        if (Xa(r[0]) && r[0].length) {
          let i = r[0]
            .replace(/(')?([a-zA-Z0-9_]+)(')?(\s)?:/g, '"$2":')
            .replace(/:(\s)?(')(.*?)(')/g, ':"$3"');
          try {
            o = JSON.parse(i);
          } catch (s) {
            throw new SyntaxError(
              `Wrong parameter in TranslatePipe. Expected a valid Object, received: ${r[0]}`,
            );
          }
        } else Jt(r[0]) && (o = r[0]);
      return (
        (this.lastKey = t),
        (this.lastParams = r),
        this.updateValue(t, o),
        this._dispose(),
        this.onTranslationChange ||
          (this.onTranslationChange = this.translate.onTranslationChange.subscribe((i) => {
            ((this.lastKey && i.lang === this.translate.getCurrentLang()) ||
              i.lang === this.translate.getFallbackLang()) &&
              ((this.lastKey = null), this.updateValue(t, o, i.translations));
          })),
        this.onLangChange ||
          (this.onLangChange = this.translate.onLangChange.subscribe((i) => {
            this.lastKey && ((this.lastKey = null), this.updateValue(t, o, i.translations));
          })),
        this.onFallbackLangChange ||
          (this.onFallbackLangChange = this.translate.onFallbackLangChange.subscribe(() => {
            this.lastKey && ((this.lastKey = null), this.updateValue(t, o));
          })),
        this.value
      );
    }
    _dispose() {
      (typeof this.onTranslationChange < 'u' &&
        (this.onTranslationChange.unsubscribe(), (this.onTranslationChange = void 0)),
        typeof this.onLangChange < 'u' &&
          (this.onLangChange.unsubscribe(), (this.onLangChange = void 0)),
        typeof this.onFallbackLangChange < 'u' &&
          (this.onFallbackLangChange.unsubscribe(), (this.onFallbackLangChange = void 0)));
    }
    ngOnDestroy() {
      this._dispose();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵpipe = xr({ name: 'translate', type: e, pure: !1 });
    static ɵprov = w({ token: e, factory: e.ɵfac });
  }
  return e;
})();
function v_(e) {
  return { provide: bn, useClass: e };
}
function y_(e) {
  return { provide: to, useClass: e };
}
function E_(e) {
  return { provide: no, useClass: e };
}
function D_(e) {
  return { provide: Si, useClass: e };
}
function Kv(e = {}, n) {
  let t = [];
  (e.loader && t.push(e.loader),
    e.compiler && t.push(e.compiler),
    e.parser && t.push(e.parser),
    e.missingTranslationHandler && t.push(e.missingTranslationHandler),
    n && t.push(yf),
    (e.useDefaultLang || e.defaultLanguage) &&
      (console.warn(
        'The `useDefaultLang` and `defaultLanguage` options are deprecated. Please use `fallbackLang` instead.',
      ),
      e.useDefaultLang === !0 && e.defaultLanguage && (e.fallbackLang = e.defaultLanguage)));
  let r = { fallbackLang: e.fallbackLang ?? null, lang: e.lang, extend: e.extend ?? !1 };
  return (
    t.push({ provide: Ef, useValue: r }),
    t.push({ provide: Xt, useClass: Xt, deps: [yf, bn, to, no, Si, Ef] }),
    t
  );
}
var et = (() => {
  class e {
    static forRoot(t = {}) {
      return {
        ngModule: e,
        providers: [
          ...Kv(
            C(
              {
                compiler: y_(d_),
                parser: E_(m_),
                loader: v_(f_),
                missingTranslationHandler: D_(u_),
              },
              t,
            ),
            !0,
          ),
        ],
      };
    }
    static forChild(t = {}) {
      return { ngModule: e, providers: [...Kv(t, t.isolate ?? !1)] };
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = Ut({ type: e });
    static ɵinj = ht({});
  }
  return e;
})();
var Cf = class {
  constructor(n) {
    this.http = n;
  }
  getTranslation(n) {
    return this.http.get(`./assets/i18n/${n}.json`).pipe(A((t) => t));
  }
};
function Xv(e) {
  return new Cf(e);
}
var ey = {
  providers: [
    vf(Yv),
    Ra(Od()),
    yo(kd),
    yo(et.forRoot({ loader: { provide: bn, useFactory: Xv, deps: [Ur] } })),
  ],
};
function C_(e, n) {
  if ((e & 1 && (E(0, 'li', 3), y(1), v()), e & 2)) {
    let t = n.$implicit;
    (g(), G(t));
  }
}
var nc = class e {
  languages;
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = Me({
    type: e,
    selectors: [['app-languages']],
    inputs: { languages: 'languages' },
    decls: 7,
    vars: 3,
    consts: [
      [1, 'languages-section', 'afborder'],
      [1, 'section-title'],
      [1, 'list-none', 'p-0'],
      [1, 'language-item'],
    ],
    template: function (t, r) {
      (t & 1 &&
        (E(0, 'section', 0)(1, 'h2', 1),
        y(2),
        H(3, 'translate'),
        v(),
        E(4, 'ul', 2),
        $t(5, C_, 2, 1, 'li', 3, Zn),
        v()()),
        t & 2 && (g(2), G(Z(3, 1, 'sections.languages')), g(3), Ht(r.languages)));
    },
    dependencies: [Le, et, ro],
    encapsulation: 2,
  });
};
function ty(e, n, t) {
  if (!e) return '';
  let r = new Date(e),
    o = n === 'present' ? t.instant('sections.present') : n ? new Date(n) : void 0,
    i = { year: 'numeric', month: 'short' },
    s = r.toLocaleDateString(t.currentLang, i),
    a = o instanceof Date ? o.toLocaleDateString(t.currentLang, i) : o;
  return `${s} \u2013 ${a}`;
}
function rc(e) {
  return e.type === 'experience';
}
var ny = (e, n) => n.startDate;
function b_(e, n) {
  if ((e & 1 && (E(0, 'h3', 6), y(1), v()), e & 2)) {
    let t = K(2).$implicit;
    (g(), G(t.company));
  }
}
function I_(e, n) {
  if ((e & 1 && (E(0, 'div', 7)(1, 'h3', 13), y(2), v(), E(3, 'span', 14), y(4), v()()), e & 2)) {
    let t = K(2).$implicit;
    (g(2), G(t.degree), g(2), G(t.institution));
  }
}
function w_(e, n) {
  if ((e & 1 && (E(0, 'span', 10), y(1), v()), e & 2)) {
    let t = K(2).$implicit,
      r = K(2);
    (g(), Ge(' ', r.formatPeriod(t.startDate, t.endDate), ' '));
  }
}
function __(e, n) {
  if (
    (e & 1 &&
      (E(0, 'div', 15),
      ga(1, 'div', 16),
      E(2, 'div', 17)(3, 'h4', 18),
      y(4),
      v(),
      E(5, 'span', 19),
      y(6),
      v()(),
      E(7, 'p', 20),
      y(8),
      v()()),
    e & 2)
  ) {
    let t = n.$implicit,
      r = K(5);
    (g(4),
      G(t.title),
      g(2),
      Ge(' ', r.formatPeriod(t.startDate, t.endDate), ' '),
      g(2),
      G(t.summary));
  }
}
function T_(e, n) {
  if ((e & 1 && (E(0, 'div', 11), $t(1, __, 9, 3, 'div', 15, ny), v()), e & 2)) {
    let t = K(2).$implicit,
      r = K(2);
    (g(), Ht(r.getExperienceRoles(t)));
  }
}
function S_(e, n) {
  if ((e & 1 && (E(0, 'span', 22), y(1), v()), e & 2)) {
    let t = n.$implicit;
    (g(), Ge(' ', t, ' '));
  }
}
function M_(e, n) {
  if ((e & 1 && (E(0, 'div', 12)(1, 'div', 21), $t(2, S_, 2, 1, 'span', 22, Zn), v()()), e & 2)) {
    let t = K(2).$implicit;
    (g(2), Ht(t.technologies));
  }
}
function N_(e, n) {
  if (
    (e & 1 &&
      (E(0, 'div', 3)(1, 'div', 4)(2, 'div', 5),
      ne(3, b_, 2, 1, 'h3', 6)(4, I_, 5, 2, 'div', 7),
      v(),
      E(5, 'div', 8)(6, 'span', 9),
      y(7),
      v(),
      ne(8, w_, 2, 1, 'span', 10),
      v()(),
      ne(9, T_, 3, 0, 'div', 11),
      ne(10, M_, 4, 0, 'div', 12),
      v()),
    e & 2)
  ) {
    let t = K().$implicit,
      r = K(2);
    (oe('experience-card', r.isExperience(t))('education-card', !r.isExperience(t)),
      g(3),
      re(r.isExperience(t) ? 3 : 4),
      g(4),
      G(t.location),
      g(),
      re(r.isExperience(t) ? -1 : 8),
      g(),
      re(r.isExperience(t) && r.getExperienceRoles(t) ? 9 : -1),
      g(),
      re(t.technologies && t.technologies.length > 0 ? 10 : -1));
  }
}
function x_(e, n) {
  if ((e & 1 && ne(0, N_, 11, 9, 'div', 2), e & 2)) {
    let t = n.$implicit;
    re(t.show !== !1 ? 0 : -1);
  }
}
function R_(e, n) {
  if ((e & 1 && $t(0, x_, 1, 1, null, null, ny), e & 2)) {
    let t = K();
    Ht(t.sortedEntries);
  }
}
function A_(e, n) {
  (e & 1 && (E(0, 'p', 1), y(1), H(2, 'translate'), v()),
    e & 2 && (g(), G(Z(2, 1, 'sections.noExperience'))));
}
var oc = class e {
  constructor(n) {
    this.translate = n;
  }
  entries;
  sortedEntries = [];
  ngOnInit() {}
  ngOnDestroy() {}
  ngOnChanges(n) {
    n.entries && this.entries && this.sortEntries();
  }
  sortEntries() {
    ((this.sortedEntries = [...this.entries]),
      this.sortedEntries.forEach((n) => {
        rc(n) &&
          n.roles &&
          n.roles.sort((t, r) => {
            let o = t.startDate ? new Date(t.startDate) : new Date(0);
            return (r.startDate ? new Date(r.startDate) : new Date(0)).getTime() - o.getTime();
          });
      }));
  }
  formatPeriod = (n, t) => ty(n, t, this.translate);
  getExperienceRoles(n) {
    if (rc(n)) return n.roles;
  }
  isExperience = rc;
  static ɵfac = function (t) {
    return new (t || e)(Ee(Xt));
  };
  static ɵcmp = Me({
    type: e,
    selectors: [['app-timeline']],
    inputs: { entries: 'entries' },
    features: [gn],
    decls: 3,
    vars: 1,
    consts: [
      [1, ''],
      [1, 'text-gray-600'],
      [
        1,
        'border-l-4',
        'py-2',
        'px-3',
        'my-sm',
        'rounded-lg',
        'mb-4',
        3,
        'experience-card',
        'education-card',
      ],
      [1, 'border-l-4', 'py-2', 'px-3', 'my-sm', 'rounded-lg', 'mb-4'],
      [1, 'flex', 'items-start', 'justify-between', 'mb-2', 'gap-2'],
      [1, 'flex', 'items-center', 'gap-2', 'flex-1', 'min-w-0'],
      [1, 'text-lg', 'font-bold', 'experience-title', 'break-words'],
      [1, 'flex', 'flex-col', 'min-w-0'],
      [1, 'text-right', 'flex-shrink-0'],
      [1, 'text-sm', 'text-gray-500', 'block'],
      [
        1,
        'text-sm',
        'font-mono',
        'text-gray-600',
        'bg-gray-100',
        'px-2',
        'py-0.5',
        'rounded',
        'inline-block',
        'mt-1',
        'whitespace-nowrap',
      ],
      [1, 'mt-3', 'space-y-4'],
      [1, 'mt-3', 'pt-2', 'border-t', 'border-gray-200'],
      [1, 'text-md', 'font-semibold', 'text-gray-800', 'break-words'],
      [1, 'text-sm', 'font-medium', 'text-gray-600', 'break-words'],
      [1, 'relative', 'pl-4', 'border-l-2', 'experience-role-border', 'ml-2'],
      [
        1,
        'absolute',
        '-left-[9px]',
        'top-0',
        'h-4',
        'w-4',
        'rounded-full',
        'experience-dot',
        'border-2',
      ],
      [1, 'flex', 'flex-wrap', 'justify-between', 'items-baseline', 'mb-1'],
      [1, 'text-md', 'font-semibold', 'experience-role-title'],
      [1, 'text-sm', 'font-mono', 'text-gray-600', 'bg-gray-100', 'px-2', 'py-0.5', 'rounded'],
      [1, 'role-summary', 'text-gray-700', 'mb-2', 'leading-relaxed'],
      [1, 'flex', 'flex-wrap', 'gap-2'],
      [
        1,
        'px-2',
        'py-1',
        'text-xs',
        'font-medium',
        'bg-white',
        'border',
        'border-gray-300',
        'rounded-md',
        'shadow-sm',
        'text-gray-700',
      ],
    ],
    template: function (t, r) {
      (t & 1 && (E(0, 'section', 0), ne(1, R_, 2, 0)(2, A_, 3, 3, 'p', 1), v()),
        t & 2 && (g(), re(r.sortedEntries && r.sortedEntries.length > 0 ? 1 : 2)));
    },
    dependencies: [Le, et, ro],
    encapsulation: 2,
  });
};
var O_ = {
    baseFontScale: 0.95,
    nameScale: 1.35,
    sectionTitleScale: 1.3,
    verticalPaddingScale: 0.8,
    photoOnTop: !1,
    asideWidth: 16,
    experienceTheme: 'purple',
    educationTheme: 'green',
    cardStyle: 'outlined',
  },
  ry = {
    blue: {
      '--exp-bg-light': '#eff6ff',
      '--exp-bg-medium': '#3b82f6',
      '--exp-border-light': '#93c5fd',
      '--exp-border-medium': '#60a5fa',
      '--exp-border-dark': '#1d4ed8',
      '--exp-text-dark': '#1e3a8a',
      '--exp-dot-border': '#ffffff',
    },
    purple: {
      '--exp-bg-light': '#f3e8ff',
      '--exp-bg-medium': '#a855f7',
      '--exp-border-light': '#d8b4fe',
      '--exp-border-medium': '#c084fc',
      '--exp-border-dark': '#7e22ce',
      '--exp-text-dark': '#581c87',
      '--exp-dot-border': '#ffffff',
    },
    teal: {
      '--exp-bg-light': '#f0fdfa',
      '--exp-bg-medium': '#14b8a6',
      '--exp-border-light': '#5eead4',
      '--exp-border-medium': '#2dd4bf',
      '--exp-border-dark': '#0f766e',
      '--exp-text-dark': '#134e4a',
      '--exp-dot-border': '#ffffff',
    },
    red: {
      '--exp-bg-light': '#fef2f2',
      '--exp-bg-medium': '#ef4444',
      '--exp-border-light': '#fca5a5',
      '--exp-border-medium': '#f87171',
      '--exp-border-dark': '#b91c1c',
      '--exp-text-dark': '#7f1d1d',
      '--exp-dot-border': '#ffffff',
    },
    gray: {
      '--exp-bg-light': '#f9fafb',
      '--exp-bg-medium': '#6b7280',
      '--exp-border-light': '#d1d5db',
      '--exp-border-medium': '#9ca3af',
      '--exp-border-dark': '#374151',
      '--exp-text-dark': '#111827',
      '--exp-dot-border': '#ffffff',
    },
  },
  oy = {
    green: { '--edu-bg-light': '#f0fdf4', '--edu-border-dark': '#15803d', '--edu-text': '#15803d' },
    blue: { '--edu-bg-light': '#eff6ff', '--edu-border-dark': '#1d4ed8', '--edu-text': '#1e3a8a' },
    purple: {
      '--edu-bg-light': '#f3e8ff',
      '--edu-border-dark': '#7e22ce',
      '--edu-text': '#581c87',
    },
    orange: {
      '--edu-bg-light': '#fff7ed',
      '--edu-border-dark': '#c2410c',
      '--edu-text': '#7c2d12',
    },
    pink: { '--edu-bg-light': '#fdf2f8', '--edu-border-dark': '#be185d', '--edu-text': '#831843' },
  },
  oo = class e {
    subj = new pe(O_);
    state$ = this.subj.asObservable();
    get state() {
      return this.subj.value;
    }
    set(n) {
      let t = C(C({}, this.state), n);
      (this.subj.next(t), this.apply(t));
    }
    apply(n) {
      let t = document.documentElement;
      (t.style.setProperty('--base-font-scale', String(n.baseFontScale)),
        t.style.setProperty('--name-scale', String(n.nameScale)),
        t.style.setProperty('--section-title-scale', String(n.sectionTitleScale)),
        t.style.setProperty('--vertical-padding-scale', String(n.verticalPaddingScale)),
        t.setAttribute('data-card-style', n.cardStyle));
      let r = ry[n.experienceTheme] || ry.blue;
      Object.keys(r).forEach((i) => {
        t.style.setProperty(i, r[i]);
      });
      let o = oy[n.educationTheme] || oy.green;
      Object.keys(o).forEach((i) => {
        t.style.setProperty(i, o[i]);
      });
    }
    init() {
      this.apply(this.state);
    }
    static ɵfac = function (t) {
      return new (t || e)();
    };
    static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: 'root' });
  };
var k_ = (e, n) => ({ width: e, maxWidth: n }),
  P_ = (e) => ({ width: e });
function L_(e, n) {
  if ((e & 1 && (B(0, 'p', 19)(1, 'a', 20), y(2), N()()), e & 2)) {
    let t = K();
    (g(), Q('href', t, It), g(), G(t));
  }
}
function F_(e, n) {
  if ((e & 1 && ne(0, L_, 3, 2, 'p', 19), e & 2)) {
    let t = n;
    re(t && t !== 'personalInfo.linkedin' ? 0 : -1);
  }
}
function j_(e, n) {
  if ((e & 1 && (B(0, 'p', 21)(1, 'a', 20), y(2), N()()), e & 2)) {
    let t = K();
    (g(), Q('href', t, It), g(), G(t));
  }
}
function B_(e, n) {
  if ((e & 1 && ne(0, j_, 3, 2, 'p', 21), e & 2)) {
    let t = n;
    re(t && t !== 'personalInfo.github' ? 0 : -1);
  }
}
function V_(e, n) {
  if (
    (e & 1 &&
      (B(0, 'div', 2)(1, 'div', 3),
      ce(2, 'img', 4),
      H(3, 'translate'),
      N(),
      B(4, 'div', 5)(5, 'h2', 6),
      y(6),
      H(7, 'translate'),
      N(),
      B(8, 'p', 7),
      y(9),
      H(10, 'translate'),
      N(),
      B(11, 'p', 8),
      y(12),
      H(13, 'translate'),
      N(),
      B(14, 'p', 9),
      y(15),
      H(16, 'translate'),
      N(),
      ne(17, F_, 1, 1),
      H(18, 'translate'),
      ne(19, B_, 1, 1),
      H(20, 'translate'),
      N()(),
      B(21, 'div', 1)(22, 'aside', 10)(23, 'div', 11)(24, 'h2', 12),
      y(25),
      H(26, 'translate'),
      N(),
      ce(27, 'p', 13),
      N(),
      ce(28, 'app-languages', 14),
      N(),
      B(29, 'section', 15)(30, 'div', 16)(31, 'h2', 12),
      y(32),
      H(33, 'translate'),
      N(),
      ce(34, 'app-timeline', 17),
      N(),
      B(35, 'div', 18)(36, 'h2', 12),
      y(37),
      H(38, 'translate'),
      N(),
      ce(39, 'app-timeline', 17),
      N()()()),
    e & 2)
  ) {
    let t,
      r,
      o = K();
    (g(2),
      Q('alt', Ar(Z(3, 16, 'profile.picture')))('src', o.profileImage, It),
      g(4),
      G(Z(7, 18, 'personalInfo.name')),
      g(3),
      G(Z(10, 20, 'personalInfo.title')),
      g(3),
      G(Z(13, 22, 'personalInfo.location')),
      g(3),
      G(Z(16, 24, 'personalInfo.email')),
      g(2),
      re((t = Z(18, 26, 'personalInfo.linkedin')) ? 17 : -1, t),
      g(2),
      re((r = Z(20, 28, 'personalInfo.github')) ? 19 : -1, r),
      g(6),
      G(Z(26, 30, 'sections.aboutMe')),
      g(2),
      Q('innerHtml', o.sanitizedObjective, oa),
      g(),
      Q('languages', o.cvData.languages),
      g(4),
      G(Z(33, 32, 'sections.experience')),
      g(2),
      Q('entries', o.cvData.experience),
      g(3),
      G(Z(38, 34, 'sections.education')),
      g(2),
      Q('entries', o.cvData.education));
  }
}
function U_(e, n) {
  if ((e & 1 && (B(0, 'p', 19)(1, 'a', 20), y(2), N()()), e & 2)) {
    let t = K();
    (g(), Q('href', t, It), g(), G(t));
  }
}
function $_(e, n) {
  if ((e & 1 && ne(0, U_, 3, 2, 'p', 19), e & 2)) {
    let t = n;
    re(t && t !== 'personalInfo.linkedin' ? 0 : -1);
  }
}
function H_(e, n) {
  if ((e & 1 && (B(0, 'p', 21)(1, 'a', 20), y(2), N()()), e & 2)) {
    let t = K();
    (g(), Q('href', t, It), g(), G(t));
  }
}
function z_(e, n) {
  if ((e & 1 && ne(0, H_, 3, 2, 'p', 21), e & 2)) {
    let t = n;
    re(t && t !== 'personalInfo.github' ? 0 : -1);
  }
}
function G_(e, n) {
  if (
    (e & 1 &&
      (B(0, 'div', 1)(1, 'aside', 22)(2, 'div', 23),
      ce(3, 'img', 24),
      H(4, 'translate'),
      N(),
      B(5, 'section', 25)(6, 'div', 26)(7, 'h2', 6),
      y(8),
      H(9, 'translate'),
      N(),
      B(10, 'p', 7),
      y(11),
      H(12, 'translate'),
      N(),
      B(13, 'p', 8),
      y(14),
      H(15, 'translate'),
      N(),
      B(16, 'p', 9),
      y(17),
      H(18, 'translate'),
      N(),
      ne(19, $_, 1, 1),
      H(20, 'translate'),
      ne(21, z_, 1, 1),
      H(22, 'translate'),
      N(),
      B(23, 'div', 27)(24, 'h2', 12),
      y(25),
      H(26, 'translate'),
      N(),
      ce(27, 'p', 28),
      N(),
      ce(28, 'app-languages', 14),
      N()(),
      B(29, 'section', 29)(30, 'div', 16)(31, 'h2', 12),
      y(32),
      H(33, 'translate'),
      N(),
      ce(34, 'app-timeline', 17),
      N(),
      B(35, 'div', 18)(36, 'h2', 12),
      y(37),
      H(38, 'translate'),
      N(),
      ce(39, 'app-timeline', 17),
      N()()()),
    e & 2)
  ) {
    let t,
      r,
      o = K();
    (g(),
      Q('ngStyle', td(38, k_, o.asideWidth + 'rem', o.asideWidthPercent + '%')),
      g(2),
      Q('alt', Ar(Z(4, 18, 'profile.picture')))('src', o.profileImage, It),
      g(5),
      G(Z(9, 20, 'personalInfo.name')),
      g(3),
      G(Z(12, 22, 'personalInfo.title')),
      g(3),
      G(Z(15, 24, 'personalInfo.location')),
      g(3),
      G(Z(18, 26, 'personalInfo.email')),
      g(2),
      re((t = Z(20, 28, 'personalInfo.linkedin')) ? 19 : -1, t),
      g(2),
      re((r = Z(22, 30, 'personalInfo.github')) ? 21 : -1, r),
      g(4),
      G(Z(26, 32, 'sections.aboutMe')),
      g(2),
      Q('innerHtml', o.sanitizedObjective, oa),
      g(),
      Q('languages', o.cvData.languages),
      g(),
      Q('ngStyle', ed(41, P_, 'calc(100% - ' + o.asideWidth + 'rem)')),
      g(3),
      G(Z(33, 34, 'sections.experience')),
      g(2),
      Q('entries', o.cvData.experience),
      g(3),
      G(Z(38, 36, 'sections.education')),
      g(2),
      Q('entries', o.cvData.education));
  }
}
var ic = class e {
  constructor(n, t, r) {
    this.translate = n;
    this.sanitizer = t;
    this.config = r;
  }
  cvData;
  profileImage;
  photoOnTop = !1;
  asideWidth = 20;
  asideWidthPercent = 40;
  ngOnInit() {
    let n = this.config.state;
    ((this.photoOnTop = n.photoOnTop),
      (this.asideWidth = n.asideWidth ?? 20),
      (this.asideWidthPercent = Math.round((this.asideWidth / 50) * 100)),
      this.config.state$.subscribe((t) => {
        ((this.photoOnTop = t.photoOnTop),
          (this.asideWidth = t.asideWidth ?? 20),
          (this.asideWidthPercent = Math.round((this.asideWidth / 50) * 100)));
      }),
      window.addEventListener('layoutChanged', this.onLayoutChanged));
  }
  ngOnChanges(n) {
    n.cvData &&
      (console.log('CvContent ngOnChanges:', this.cvData),
      console.log('CvContent config state:', this.config.state));
  }
  ngOnDestroy() {
    window.removeEventListener('layoutChanged', this.onLayoutChanged);
  }
  onLayoutChanged = (n) => {
    let { photoOnTop: t } = n.detail;
    this.photoOnTop = t;
  };
  get sanitizedObjective() {
    let n = this.translate.instant('personalInfo.objective');
    return this.sanitizer.bypassSecurityTrustHtml(n);
  }
  changeLanguage(n) {
    this.translate.use(n);
  }
  static ɵfac = function (t) {
    return new (t || e)(Ee(Xt), Ee(Pd), Ee(oo));
  };
  static ɵcmp = Me({
    type: e,
    selectors: [['app-cv-content']],
    inputs: { cvData: 'cvData', profileImage: 'profileImage' },
    features: [gn],
    decls: 3,
    vars: 1,
    consts: [
      [1, 'a4-page'],
      [1, 'flexaf'],
      [1, 'profile-and-info'],
      [1, 'profile-image-container', 'profile-image-top'],
      [1, 'profile-image', 3, 'src', 'alt'],
      [1, 'personal-info'],
      [1, 'name'],
      [1, 'title'],
      [1, 'location'],
      [1, 'email'],
      [1, 'profile-personal-info-group', 'afborder'],
      [1, 'about-me-section'],
      [1, 'section-title'],
      [1, 'objective', 3, 'innerHtml'],
      [3, 'languages'],
      [1, 'main-content'],
      [1, 'experience-section', 'mb-2'],
      [3, 'entries'],
      [1, 'education-section'],
      [1, 'linkedin'],
      ['target', '_blank', 'rel', 'noopener noreferrer', 3, 'href'],
      [1, 'github'],
      [1, 'profile-personal-info-group', 'afborder', 3, 'ngStyle'],
      [1, 'profile-image-container'],
      [1, 'profile-image', 2, 'max-width', '100%', 'max-height', '100%', 3, 'src', 'alt'],
      [1, 'personal-info', 'afborder2'],
      [1, 'personal-info-block', 'afborder2'],
      [1, 'about-me-block', 'afborder2'],
      [1, 'summary-text', 3, 'innerHtml'],
      [1, 'main-content', 'afborder', 3, 'ngStyle'],
    ],
    template: function (t, r) {
      (t & 1 && (B(0, 'main', 0), ne(1, V_, 40, 36)(2, G_, 40, 43, 'div', 1), N()),
        t & 2 && (g(), re(r.photoOnTop ? 1 : 2)));
    },
    dependencies: [Le, pd, nc, et, oc, ro],
    encapsulation: 2,
  });
};
var sc = class e {
  constructor(n) {
    this.config = n;
    let t = this.config.state;
    ((this.baseFontScale = t.baseFontScale || 1),
      (this.nameScale = t.nameScale || 1),
      (this.sectionTitleScale = t.sectionTitleScale || 1),
      (this.asideWidth = t.asideWidth ?? 20),
      (this.verticalPaddingScale = t.verticalPaddingScale),
      (this.photoOnTop = t.photoOnTop),
      (this.experienceTheme = t.experienceTheme || 'blue'),
      (this.educationTheme = t.educationTheme || 'green'),
      (this.cardStyle = t.cardStyle || 'outlined'),
      this.config.init(),
      this.config.state$.subscribe((r) => {
        ((this.baseFontScale = r.baseFontScale || 1),
          (this.nameScale = r.nameScale || 1),
          (this.sectionTitleScale = r.sectionTitleScale || 1),
          (this.asideWidth = r.asideWidth ?? 20),
          (this.verticalPaddingScale = r.verticalPaddingScale),
          (this.photoOnTop = r.photoOnTop),
          (this.experienceTheme = r.experienceTheme || 'blue'),
          (this.educationTheme = r.educationTheme || 'green'),
          (this.cardStyle = r.cardStyle || 'outlined'));
      }));
  }
  baseFontScale = 1;
  nameScale = 1;
  sectionTitleScale = 1;
  asideWidth = 20;
  verticalPaddingScale = 1;
  photoOnTop = !1;
  experienceTheme = 'blue';
  educationTheme = 'green';
  cardStyle = 'outlined';
  onNameScaleChange(n) {
    let t = n.target,
      r = parseFloat(t.value);
    (this.config.set({ nameScale: r }),
      this.logCurrentConfiguration('\u{1F464} Name Scale Applied'));
  }
  onSectionTitleScaleChange(n) {
    let t = n.target,
      r = parseFloat(t.value);
    (this.config.set({ sectionTitleScale: r }),
      this.logCurrentConfiguration('\u{1F4D1} Section Title Scale Applied'));
  }
  onBaseFontScaleChange(n) {
    let t = n.target,
      r = parseFloat(t.value);
    (this.config.set({ baseFontScale: r }),
      this.logCurrentConfiguration('\u{1F4DD} Base Font Scale Applied'));
  }
  onAsideWidthChange(n) {
    let t = n.target,
      r = parseInt(t.value, 10);
    (this.config.set({ asideWidth: r }),
      this.logCurrentConfiguration('\u{1F4CF} Aside Width Applied'));
  }
  onVerticalPaddingScaleChange(n) {
    let t = n.target,
      r = parseFloat(t.value);
    (this.config.set({ verticalPaddingScale: r }),
      this.logCurrentConfiguration('\u{1F4D0} Vertical Padding Scale Applied'));
  }
  onPhotoOnTopChange(n) {
    let r = n.target.checked;
    (this.config.set({ photoOnTop: r }),
      this.logCurrentConfiguration('\u{1F5BC}\uFE0F Layout Toggled'),
      this.notifyLayoutChange());
  }
  setTheme(n) {
    (this.config.set({ experienceTheme: n }),
      this.logCurrentConfiguration('\u{1F3A8} Experience Theme: ' + n));
  }
  setEducationTheme(n) {
    (this.config.set({ educationTheme: n }),
      this.logCurrentConfiguration('\u{1F393} Education Theme: ' + n));
  }
  setCardStyle(n) {
    (this.config.set({ cardStyle: n }), this.logCurrentConfiguration('\u{1F3B4} Card Style: ' + n));
  }
  setNameScale(n) {
    (this.config.set({ nameScale: n }),
      this.logCurrentConfiguration('\u{1F464} Name Scale Applied'));
  }
  setSectionTitleScale(n) {
    (this.config.set({ sectionTitleScale: n }),
      this.logCurrentConfiguration('\u{1F4D1} Section Title Scale Applied'));
  }
  setAsideWidth(n) {
    (this.config.set({ asideWidth: n }),
      this.logCurrentConfiguration('\u{1F4CF} Aside Width Applied'));
  }
  setVerticalPaddingScale(n) {
    (this.config.set({ verticalPaddingScale: n }),
      this.logCurrentConfiguration('\u{1F4D0} Vertical Padding Scale Applied'));
  }
  setBaseFontScale(n) {
    (this.config.set({ baseFontScale: n }),
      this.logCurrentConfiguration('\u{1F4DD} Base Font Scale Applied'));
  }
  notifyLayoutChange() {
    let n = new CustomEvent('layoutChanged', { detail: { photoOnTop: this.photoOnTop } });
    window.dispatchEvent(n);
  }
  logCurrentConfiguration(n) {
    let t = { photoOnTop: this.photoOnTop ? 'Photo and About Me on top' : 'Original layout' },
      r = {
        action: n,
        timestamp: new Date().toLocaleTimeString(),
        scales: {
          baseFontScale: {
            value: this.baseFontScale,
            percentage: Math.round(this.baseFontScale * 100) + '%',
          },
          nameScale: { value: this.nameScale, percentage: Math.round(this.nameScale * 100) + '%' },
          sectionTitleScale: {
            value: this.sectionTitleScale,
            percentage: Math.round(this.sectionTitleScale * 100) + '%',
          },
          asideWidth: { value: this.asideWidth, unit: 'rem' },
          verticalPaddingScale: {
            value: this.verticalPaddingScale,
            percentage: Math.round(this.verticalPaddingScale * 100) + '%',
          },
          layout: { photoOnTop: this.photoOnTop },
          theme: this.experienceTheme,
          layoutHuman: t,
        },
      };
    (console.log('\u{1F39B}\uFE0F CV Configuration Applied:', r),
      console.log('\u{1F4CB} Copy this configuration for print styles:', {
        baseFontScale: this.baseFontScale,
        nameScale: this.nameScale,
        sectionTitleScale: this.sectionTitleScale,
        photoOnTop: this.photoOnTop,
        asideWidth: this.asideWidth,
        experienceTheme: this.experienceTheme,
        educationTheme: this.educationTheme,
        cardStyle: this.cardStyle,
        layoutLabel: t.photoOnTop,
      }));
  }
  static ɵfac = function (t) {
    return new (t || e)(Ee(oo));
  };
  static ɵcmp = Me({
    type: e,
    selectors: [['app-unified-control']],
    decls: 111,
    vars: 52,
    consts: [
      [1, 'unified-control-panel', 'print:hidden'],
      [1, 'version-info'],
      [1, 'version-label'],
      [1, 'control-section'],
      [1, 'control-label'],
      [
        'type',
        'range',
        'min',
        '0.8',
        'max',
        '2.0',
        'step',
        '0.05',
        1,
        'control-slider',
        3,
        'input',
        'value',
      ],
      [1, 'control-buttons'],
      [1, 'control-btn', 3, 'click'],
      [
        'type',
        'range',
        'min',
        '0.8',
        'max',
        '2.5',
        'step',
        '0.05',
        1,
        'control-slider',
        3,
        'input',
        'value',
      ],
      [
        'type',
        'range',
        'min',
        '0.7',
        'max',
        '1.3',
        'step',
        '0.05',
        1,
        'control-slider',
        3,
        'input',
        'value',
      ],
      [
        'type',
        'range',
        'min',
        '10',
        'max',
        '40',
        'step',
        '1',
        1,
        'control-slider',
        3,
        'input',
        'value',
      ],
      [
        'type',
        'range',
        'min',
        '0.4',
        'max',
        '1.2',
        'step',
        '0.05',
        1,
        'control-slider',
        3,
        'input',
        'value',
      ],
      [1, 'theme-buttons'],
      ['title', 'Blue', 1, 'theme-btn', 2, 'background-color', '#3b82f6', 3, 'click'],
      ['title', 'Purple', 1, 'theme-btn', 2, 'background-color', '#a855f7', 3, 'click'],
      ['title', 'Teal', 1, 'theme-btn', 2, 'background-color', '#14b8a6', 3, 'click'],
      ['title', 'Red', 1, 'theme-btn', 2, 'background-color', '#ef4444', 3, 'click'],
      ['title', 'Gray', 1, 'theme-btn', 2, 'background-color', '#6b7280', 3, 'click'],
      ['title', 'Green', 1, 'theme-btn', 2, 'background-color', '#22c55e', 3, 'click'],
      ['title', 'Orange', 1, 'theme-btn', 2, 'background-color', '#f97316', 3, 'click'],
      ['title', 'Pink', 1, 'theme-btn', 2, 'background-color', '#ec4899', 3, 'click'],
      [1, 'checkbox-container'],
      ['type', 'checkbox', 1, 'control-checkbox', 3, 'change', 'checked'],
      [1, 'checkbox-label'],
    ],
    template: function (t, r) {
      (t & 1 &&
        (E(0, 'div', 0)(1, 'div', 1)(2, 'span', 2),
        y(3, 'v1.0.0'),
        v()(),
        E(4, 'div', 3)(5, 'label', 4),
        y(6),
        H(7, 'number'),
        v(),
        E(8, 'input', 5),
        P('input', function (i) {
          return r.onNameScaleChange(i);
        }),
        v(),
        E(9, 'div', 6)(10, 'button', 7),
        P('click', function () {
          return r.setNameScale(0.9);
        }),
        y(11, '90%'),
        v(),
        E(12, 'button', 7),
        P('click', function () {
          return r.setNameScale(1);
        }),
        y(13, '100%'),
        v(),
        E(14, 'button', 7),
        P('click', function () {
          return r.setNameScale(1.2);
        }),
        y(15, '120%'),
        v(),
        E(16, 'button', 7),
        P('click', function () {
          return r.setNameScale(1.5);
        }),
        y(17, '150%'),
        v()()(),
        E(18, 'div', 3)(19, 'label', 4),
        y(20),
        H(21, 'number'),
        v(),
        E(22, 'input', 8),
        P('input', function (i) {
          return r.onSectionTitleScaleChange(i);
        }),
        v(),
        E(23, 'div', 6)(24, 'button', 7),
        P('click', function () {
          return r.setSectionTitleScale(0.9);
        }),
        y(25, '90%'),
        v(),
        E(26, 'button', 7),
        P('click', function () {
          return r.setSectionTitleScale(1);
        }),
        y(27, '100%'),
        v(),
        E(28, 'button', 7),
        P('click', function () {
          return r.setSectionTitleScale(1.3);
        }),
        y(29, '130%'),
        v(),
        E(30, 'button', 7),
        P('click', function () {
          return r.setSectionTitleScale(1.6);
        }),
        y(31, '160%'),
        v(),
        E(32, 'button', 7),
        P('click', function () {
          return r.setSectionTitleScale(2);
        }),
        y(33, '200%'),
        v()()(),
        E(34, 'div', 3)(35, 'label', 4),
        y(36),
        H(37, 'number'),
        v(),
        E(38, 'input', 9),
        P('input', function (i) {
          return r.onBaseFontScaleChange(i);
        }),
        v(),
        E(39, 'div', 6)(40, 'button', 7),
        P('click', function () {
          return r.setBaseFontScale(0.8);
        }),
        y(41, '80%'),
        v(),
        E(42, 'button', 7),
        P('click', function () {
          return r.setBaseFontScale(0.9);
        }),
        y(43, '90%'),
        v(),
        E(44, 'button', 7),
        P('click', function () {
          return r.setBaseFontScale(1);
        }),
        y(45, '100%'),
        v(),
        E(46, 'button', 7),
        P('click', function () {
          return r.setBaseFontScale(1.1);
        }),
        y(47, '110%'),
        v()()(),
        E(48, 'div', 3)(49, 'label', 4),
        y(50),
        H(51, 'number'),
        v(),
        E(52, 'input', 10),
        P('input', function (i) {
          return r.onAsideWidthChange(i);
        }),
        v(),
        E(53, 'div', 6)(54, 'button', 7),
        P('click', function () {
          return r.setAsideWidth(15);
        }),
        y(55, '15'),
        v(),
        E(56, 'button', 7),
        P('click', function () {
          return r.setAsideWidth(20);
        }),
        y(57, '20'),
        v(),
        E(58, 'button', 7),
        P('click', function () {
          return r.setAsideWidth(25);
        }),
        y(59, '25'),
        v()()(),
        E(60, 'div', 3)(61, 'label', 4),
        y(62),
        H(63, 'number'),
        v(),
        E(64, 'input', 11),
        P('input', function (i) {
          return r.onVerticalPaddingScaleChange(i);
        }),
        v(),
        E(65, 'div', 6)(66, 'button', 7),
        P('click', function () {
          return r.setVerticalPaddingScale(0.5);
        }),
        y(67, '50%'),
        v(),
        E(68, 'button', 7),
        P('click', function () {
          return r.setVerticalPaddingScale(0.6);
        }),
        y(69, '60%'),
        v(),
        E(70, 'button', 7),
        P('click', function () {
          return r.setVerticalPaddingScale(0.7);
        }),
        y(71, '70%'),
        v(),
        E(72, 'button', 7),
        P('click', function () {
          return r.setVerticalPaddingScale(0.8);
        }),
        y(73, '80%'),
        v(),
        E(74, 'button', 7),
        P('click', function () {
          return r.setVerticalPaddingScale(1);
        }),
        y(75, '100%'),
        v()()(),
        E(76, 'div', 3)(77, 'label', 4),
        y(78, 'Card Style:'),
        v(),
        E(79, 'div', 6)(80, 'button', 7),
        P('click', function () {
          return r.setCardStyle('filled');
        }),
        y(81, 'Filled'),
        v(),
        E(82, 'button', 7),
        P('click', function () {
          return r.setCardStyle('subtle');
        }),
        y(83, 'Subtle'),
        v(),
        E(84, 'button', 7),
        P('click', function () {
          return r.setCardStyle('outlined');
        }),
        y(85, 'Outlined'),
        v()()(),
        E(86, 'div', 3)(87, 'label', 4),
        y(88, 'Experience Color:'),
        v(),
        E(89, 'div', 12)(90, 'button', 13),
        P('click', function () {
          return r.setTheme('blue');
        }),
        v(),
        E(91, 'button', 14),
        P('click', function () {
          return r.setTheme('purple');
        }),
        v(),
        E(92, 'button', 15),
        P('click', function () {
          return r.setTheme('teal');
        }),
        v(),
        E(93, 'button', 16),
        P('click', function () {
          return r.setTheme('red');
        }),
        v(),
        E(94, 'button', 17),
        P('click', function () {
          return r.setTheme('gray');
        }),
        v()()(),
        E(95, 'div', 3)(96, 'label', 4),
        y(97, 'Education Color:'),
        v(),
        E(98, 'div', 12)(99, 'button', 18),
        P('click', function () {
          return r.setEducationTheme('green');
        }),
        v(),
        E(100, 'button', 13),
        P('click', function () {
          return r.setEducationTheme('blue');
        }),
        v(),
        E(101, 'button', 14),
        P('click', function () {
          return r.setEducationTheme('purple');
        }),
        v(),
        E(102, 'button', 19),
        P('click', function () {
          return r.setEducationTheme('orange');
        }),
        v(),
        E(103, 'button', 20),
        P('click', function () {
          return r.setEducationTheme('pink');
        }),
        v()()(),
        E(104, 'div', 3)(105, 'label', 4),
        y(106, 'Layout:'),
        v(),
        E(107, 'div', 21)(108, 'input', 22),
        P('change', function (i) {
          return r.onPhotoOnTopChange(i);
        }),
        v(),
        E(109, 'span', 23),
        y(110, 'Photo and About Me on top'),
        v()()()()),
        t & 2 &&
          (g(6),
          Ge('Name Scale: ', Qn(7, 37, r.nameScale, '1.2-2')),
          g(2),
          zt('value', r.nameScale),
          g(12),
          Ge('Section Titles Scale: ', Qn(21, 40, r.sectionTitleScale, '1.2-2')),
          g(2),
          zt('value', r.sectionTitleScale),
          g(14),
          Ge('Base Font Scale: ', Qn(37, 43, r.baseFontScale, '1.2-2')),
          g(2),
          zt('value', r.baseFontScale),
          g(12),
          Ge('Aside Width: ', Qn(51, 46, r.asideWidth, '1.0-2'), 'rem'),
          g(2),
          zt('value', r.asideWidth),
          g(10),
          Ge('Vertical Padding: ', Qn(63, 49, r.verticalPaddingScale, '1.2-2')),
          g(2),
          zt('value', r.verticalPaddingScale),
          g(16),
          oe('active-style', r.cardStyle === 'filled'),
          g(2),
          oe('active-style', r.cardStyle === 'subtle'),
          g(2),
          oe('active-style', r.cardStyle === 'outlined'),
          g(6),
          oe('active', r.experienceTheme === 'blue'),
          g(),
          oe('active', r.experienceTheme === 'purple'),
          g(),
          oe('active', r.experienceTheme === 'teal'),
          g(),
          oe('active', r.experienceTheme === 'red'),
          g(),
          oe('active', r.experienceTheme === 'gray'),
          g(5),
          oe('active', r.educationTheme === 'green'),
          g(),
          oe('active', r.educationTheme === 'blue'),
          g(),
          oe('active', r.educationTheme === 'purple'),
          g(),
          oe('active', r.educationTheme === 'orange'),
          g(),
          oe('active', r.educationTheme === 'pink'),
          g(5),
          zt('checked', r.photoOnTop)));
    },
    dependencies: [Le, gd],
    styles: [
      '.unified-control-panel[_ngcontent-%COMP%]{padding:15px;font-size:12px;background:#fff}.control-section[_ngcontent-%COMP%]{margin-bottom:15px;padding-bottom:10px;border-bottom:1px solid #eee}.control-section[_ngcontent-%COMP%]:last-child{border-bottom:none;margin-bottom:0}.control-label[_ngcontent-%COMP%]{display:block;margin-bottom:5px;font-weight:700;font-size:11px}.control-slider[_ngcontent-%COMP%]{width:100%;margin-bottom:8px}.control-buttons[_ngcontent-%COMP%]{display:flex;gap:3px;flex-wrap:wrap}.control-btn[_ngcontent-%COMP%]{padding:2px 4px;border:1px solid #ccc;background:#f5f5f5;border-radius:4px;cursor:pointer;font-size:9px;min-width:25px}.control-btn[_ngcontent-%COMP%]:hover{background:#e5e5e5}.control-btn.active-style[_ngcontent-%COMP%]{background:#2196f3;color:#fff;border-color:#1976d2}.checkbox-container[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;margin-top:5px}.control-checkbox[_ngcontent-%COMP%]{width:16px;height:16px;cursor:pointer}.checkbox-label[_ngcontent-%COMP%]{font-size:10px;color:#374151;cursor:pointer}.version-info[_ngcontent-%COMP%]{text-align:center;padding:8px;margin-bottom:10px;background:#f8f9fa;border-radius:4px}.version-label[_ngcontent-%COMP%]{font-size:10px;color:#6b7280;font-weight:600}.theme-buttons[_ngcontent-%COMP%]{display:flex;gap:8px;flex-wrap:wrap}.theme-btn[_ngcontent-%COMP%]{width:28px;height:28px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:transform .2s,border-color .2s}.theme-btn[_ngcontent-%COMP%]:hover{transform:scale(1.1)}.theme-btn.active[_ngcontent-%COMP%]{border-color:#333;border-width:3px;transform:scale(1.15)}',
    ],
  });
};
function W_(e, n) {
  if (e & 1) {
    let t = ma();
    (B(0, 'button', 10),
      wt('click', function () {
        Mo(t);
        let o = K();
        return No(o.toggleVisibility());
      }),
      y(1, ' \u2630 '),
      N());
  }
}
function q_(e, n) {
  if (e & 1) {
    let t = ma();
    (B(0, 'button', 11),
      H(1, 'uppercase'),
      wt('click', function () {
        let o = Mo(t).$implicit,
          i = K();
        return No(i.onLanguageChange(o));
      }),
      ce(2, 'img', 12),
      H(3, 'uppercase'),
      N());
  }
  if (e & 2) {
    let t = n.$implicit,
      r = K();
    (oe('active', t === r.currentLanguage),
      Q('title', Z(1, 7, t)),
      g(2),
      Q('src', Xu('./assets/flags/', t, '.png'), It)('alt', Ar(Z(3, 9, t))));
  }
}
var ac = class e {
  availableLanguages = [];
  currentLanguage = 'en';
  languageChange = new ye();
  print = new ye();
  controlsExpanded = new ye();
  isVisible = !0;
  isExpanded = !1;
  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
  toggleControls() {
    ((this.isExpanded = !this.isExpanded), this.controlsExpanded.emit(this.isExpanded));
  }
  onLanguageChange(n) {
    this.languageChange.emit(n);
  }
  onPrint() {
    this.print.emit();
  }
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = Me({
    type: e,
    selectors: [['app-toolbar']],
    inputs: { availableLanguages: 'availableLanguages', currentLanguage: 'currentLanguage' },
    outputs: {
      languageChange: 'languageChange',
      print: 'print',
      controlsExpanded: 'controlsExpanded',
    },
    decls: 16,
    vars: 8,
    consts: [
      ['title', 'Mostrar men\xFA', 1, 'show-toolbar-btn', 'print:hidden'],
      [1, 'toolbar-container', 'print:hidden'],
      [1, 'toolbar-header'],
      ['title', 'Ocultar men\xFA', 1, 'close-btn', 3, 'click'],
      [1, 'language-flags'],
      [1, 'flag-button', 3, 'active', 'title'],
      [1, 'print-button', 3, 'click'],
      [1, 'toggle-controls-button', 3, 'click', 'title'],
      [1, 'toggle-icon'],
      [1, 'controls-panel'],
      ['title', 'Mostrar men\xFA', 1, 'show-toolbar-btn', 'print:hidden', 3, 'click'],
      [1, 'flag-button', 3, 'click', 'title'],
      [1, 'flag-image', 3, 'src', 'alt'],
    ],
    template: function (t, r) {
      (t & 1 &&
        (ne(0, W_, 2, 0, 'button', 0),
        B(1, 'div', 1)(2, 'div', 2)(3, 'button', 3),
        wt('click', function () {
          return r.toggleVisibility();
        }),
        y(4, '\u2715'),
        N(),
        B(5, 'div', 4),
        $t(6, q_, 4, 11, 'button', 5, Zn),
        N(),
        B(8, 'button', 6),
        wt('click', function () {
          return r.onPrint();
        }),
        y(9, ' \u{1F5A8}\uFE0F Print CV '),
        N(),
        B(10, 'button', 7),
        wt('click', function () {
          return r.toggleControls();
        }),
        B(11, 'span', 8),
        y(12, '\u25B6'),
        N(),
        y(13, ' \u2699\uFE0F Controls '),
        N()(),
        B(14, 'div', 9),
        ce(15, 'app-unified-control'),
        N()()),
        t & 2 &&
          (re(r.isVisible ? -1 : 0),
          g(),
          oe('hidden-toolbar', !r.isVisible),
          g(5),
          Ht(r.availableLanguages),
          g(4),
          Q('title', r.isExpanded ? 'Contraer controles' : 'Expandir controles'),
          g(),
          oe('rotated', r.isExpanded),
          g(3),
          oe('expanded', r.isExpanded)));
    },
    dependencies: [Le, et, sc, hd],
    styles: [
      '.toolbar-container[_ngcontent-%COMP%]{position:fixed;top:10px;right:10px;background:#fff;border:2px solid #ccc;border-radius:8px;box-shadow:0 2px 10px #0000001a;z-index:1000;min-width:220px;overflow:hidden;transition:transform .3s ease-in-out,opacity .3s}.toolbar-container.hidden-toolbar[_ngcontent-%COMP%]{transform:translate(120%);opacity:0;pointer-events:none}.show-toolbar-btn[_ngcontent-%COMP%]{position:fixed;top:10px;right:10px;z-index:1000;background:#fff;border:2px solid #ccc;border-radius:50%;width:40px;height:40px;font-size:20px;cursor:pointer;box-shadow:0 2px 5px #0003;display:flex;align-items:center;justify-content:center;transition:transform .2s}.show-toolbar-btn[_ngcontent-%COMP%]:hover{transform:scale(1.1);background:#f0f0f0}.toolbar-header[_ngcontent-%COMP%]{padding:10px;background:#f8f9fa;border-bottom:1px solid #e0e0e0;position:relative}.close-btn[_ngcontent-%COMP%]{position:absolute;top:5px;right:5px;background:transparent;border:none;font-size:14px;cursor:pointer;color:#666;padding:2px 6px;border-radius:4px}.close-btn[_ngcontent-%COMP%]:hover{background:#eee;color:#333}.language-flags[_ngcontent-%COMP%]{display:flex;gap:8px;margin-bottom:8px;justify-content:center;margin-top:10px}.flag-button[_ngcontent-%COMP%]{padding:4px;border:2px solid transparent;background:transparent;border-radius:4px;cursor:pointer;transition:all .2s}.flag-button[_ngcontent-%COMP%]:hover{border-color:#4caf50;transform:scale(1.1)}.flag-button.active[_ngcontent-%COMP%]{border-color:#2196f3;background:#e3f2fd}.flag-image[_ngcontent-%COMP%]{width:28px;height:28px;display:block;object-fit:cover}.print-button[_ngcontent-%COMP%]{width:100%;padding:10px;margin-bottom:8px;background:#4caf50;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:14px;font-weight:600;transition:background .2s}.print-button[_ngcontent-%COMP%]:hover{background:#45a049}.toggle-controls-button[_ngcontent-%COMP%]{width:100%;padding:10px;background:#2196f3;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px;transition:background .2s}.toggle-controls-button[_ngcontent-%COMP%]:hover{background:#1976d2}.toggle-icon[_ngcontent-%COMP%]{font-size:10px;transition:transform .3s;display:inline-block}.toggle-icon.rotated[_ngcontent-%COMP%]{transform:rotate(90deg)}.controls-panel[_ngcontent-%COMP%]{max-height:0;overflow:hidden;transition:max-height .3s ease-in-out}.controls-panel.expanded[_ngcontent-%COMP%]{max-height:calc(100vh - 200px);overflow-y:auto}@media (max-width: 768px){.toolbar-container[_ngcontent-%COMP%]{right:5px;top:5px;min-width:180px}.show-toolbar-btn[_ngcontent-%COMP%]{right:5px;top:5px}}',
    ],
  });
};
function Z_(e, n) {
  e & 1 && ce(0, 'div', 3);
}
function Y_(e, n) {
  if ((e & 1 && (ce(0, 'app-cv-content', 2), ne(1, Z_, 1, 0, 'div', 3)), e & 2)) {
    let t = K();
    (Q('cvData', t.cvData)('profileImage', t.profileImage), g(), re(t.showRedGuide ? 1 : -1));
  }
}
var cc = class e {
  constructor(n, t) {
    this.translate = n;
    this.http = t;
    console.log('App Constructor - translate service initialized');
  }
  title = Un('cv25Angular');
  cvData;
  profileImage = './assets/yo2.jpg';
  currentLanguageDisplay = '';
  showRedGuide = !1;
  ngOnInit() {
    (console.log('App ngOnInit - starting initialization'),
      this.translate.addLangs(['en', 'es']),
      this.translate.setDefaultLang('en'));
    let n = this.translate.getBrowserLang(),
      t = n && n.match(/en|es/) ? n : 'en';
    (console.log(`App ngOnInit - Initializing with language: ${t}`),
      this.translate.use(t).subscribe(() => {
        (console.log(`App ngOnInit - Initial translations for ${t} loaded.`),
          this.loadAndSetCvData(),
          (this.currentLanguageDisplay = this.translate.currentLang));
      }),
      this.translate.onLangChange.subscribe((r) => {
        (console.log(`App onLangChange - Language changed to: ${r.lang}`),
          this.loadAndSetCvData(),
          (this.currentLanguageDisplay = r.lang));
      }));
  }
  loadAndSetCvData() {
    console.log('App loadAndSetCvData - Attempting to load CV data.');
    let n = this.translate.currentLang;
    this.http.get(`./assets/i18n/${n}.json`).subscribe((t) => {
      (console.log('App loadAndSetCvData - CV data received:', t),
        (this.cvData = t),
        console.log('App loadAndSetCvData - cvData assigned:', this.cvData));
    });
  }
  printPage() {
    window.print();
  }
  changeLanguage(n) {
    this.translate.use(n).subscribe(() => {
      (console.log(`App changeLanguage - Language changed to: ${n}`),
        this.loadAndSetCvData(),
        (this.currentLanguageDisplay = this.translate.currentLang));
    });
  }
  getCurrentLanguage() {
    return this.translate.currentLang;
  }
  getAvailableLanguages() {
    return this.translate.getLangs();
  }
  onControlsExpanded(n) {
    this.showRedGuide = n;
  }
  static ɵfac = function (t) {
    return new (t || e)(Ee(Xt), Ee(Ur));
  };
  static ɵcmp = Me({
    type: e,
    selectors: [['app-root']],
    decls: 3,
    vars: 3,
    consts: [
      [3, 'languageChange', 'print', 'controlsExpanded', 'availableLanguages', 'currentLanguage'],
      [1, 'main-container'],
      [3, 'cvData', 'profileImage'],
      [1, 'red-guide'],
    ],
    template: function (t, r) {
      (t & 1 &&
        (B(0, 'app-toolbar', 0),
        wt('languageChange', function (i) {
          return r.changeLanguage(i);
        })('print', function () {
          return r.printPage();
        })('controlsExpanded', function (i) {
          return r.onControlsExpanded(i);
        }),
        N(),
        B(1, 'main', 1),
        ne(2, Y_, 2, 3),
        N()),
        t & 2 &&
          (Q('availableLanguages', r.getAvailableLanguages())(
            'currentLanguage',
            r.getCurrentLanguage(),
          ),
          g(2),
          re(r.cvData ? 2 : -1)));
    },
    dependencies: [et, ic, Le, ac],
    encapsulation: 2,
  });
};
_d(cc, ey).catch((e) => console.error(e));
